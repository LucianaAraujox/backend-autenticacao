const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/Usuario'); // Modelo Sequelize

// Cadastra um novo usuário no banco de dados.
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Nome de usuário já está em uso.' });
    }

    // Criptografa a senha e salva no banco
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'Usuário criado com sucesso', id: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
};

// Autentica o usuário e retorna um token JWT.
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca usuário no banco
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Compara senhas
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Gera token com ID do usuário
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao autenticar usuário', error });
  }
};

// Retorna os dados do usuário autenticado.
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Perfil do usuário', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil', error });
  }
};