const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario } = require('../../models'); // <- isso puxa do index.js, já instanciado
const { Op } = require('sequelize');

// Registrar novo usuário
const registerUser = async (req, res) => {
  try {
    // Log de entrada do cadastro
    console.log('Body recebido no cadastro:', req.body);

    const {
      nomeCompleto,
      email,
      cpf,
      telefone,
      endereco,
      username,
      password
    } = req.body;

    // Verifica se já existe email ou username ou cpf
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { cpf }]
      }
    });

    if (usuarioExistente) {
      return res.status(409).json({ message: 'Já existe um usuário com esse email, CPF ou username.' });
    }

    // Validação da senha
    const senhaForte = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!senhaForte.test(password)) {
      return res.status(400).json({
        message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras e números.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário
    const novoUsuario = await Usuario.create({
      nomeCompleto,
      email,
      cpf,
      telefone,
      endereco,
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      id: novoUsuario.id
    });
  } catch (error) {
    // 🧯 Log do erro interno
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    console.log('Tentativa de login:', req.body);

    const { username, password } = req.body;
    const user = await Usuario.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ message: 'Erro ao autenticar usuário', error });
  }
};
// Listar usuários
const listUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: { exclude: ['password'] } // remove senha da resposta
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar usuários', error: err.message });
  }
};

// Perfil logado
const getProfile = async (req, res) => {
  try {
    console.log('Buscando perfil do ID:', req.user.id);

    const user = await Usuario.findByPk(req.user.id, {
      attributes: ['id', 'nomeCompleto', 'email', 'cpf', 'telefone', 'endereco', 'username', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      message: 'Perfil carregado com sucesso',
      user: {
        id: user.id,
        nomeCompleto: user.nomeCompleto,
        email: user.email,
        cpf: user.cpf,
        telefone: user.telefone,
        endereco: user.endereco,
        username: user.username,
        criado_em: user.createdAt
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil', error });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    nomeCompleto,
    email,
    cpf,
    telefone,
    endereco,
    username,
    password
  } = req.body;

  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const camposAtualizados = {};

    // Atualiza apenas os campos enviados
    if (nomeCompleto) camposAtualizados.nomeCompleto = nomeCompleto;
    if (email) camposAtualizados.email = email;
    if (cpf) camposAtualizados.cpf = cpf;
    if (telefone) camposAtualizados.telefone = telefone;
    if (endereco) camposAtualizados.endereco = endereco;
    if (username) camposAtualizados.username = username;
    if (password) {
      const senhaForte = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!senhaForte.test(password)) {
        return res.status(400).json({
          message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras e números.'
        });
      }
      camposAtualizados.password = await bcrypt.hash(password, 10);
    }

    await user.update(camposAtualizados);

    res.status(200).json({ message: 'Usuário atualizado com sucesso!', user });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  listUsers,
  getProfile,
  updateUser
};