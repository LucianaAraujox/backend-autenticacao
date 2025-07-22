const bcrypt = require('bcrypt');
const Usuario = require('../../models/Usuario');

const registerUser = async (req, res) => {
  try {
  
    const {
      nomeCompleto,
      email,
      cpf,
      telefone,
      endereco,
      username,
      password
    } = req.body;

    console.log('Dados recebidos:', req.body);
    console.log('Tentando criar usuário...');

    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.error('🔥 Erro interno ao cadastrar usuário:', error); 
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
};