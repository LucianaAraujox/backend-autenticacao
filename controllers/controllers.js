const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = []; // Aqui usamos um array para simular um banco de dados temporário

const registerUser = async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  if (!nome || !sobrenome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'Usuário já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  const newUser = { id: users.length + 1, nome, sobrenome, email, senha: hashedPassword };
  users.push(newUser);

  return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
};

const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha email e senha' });
  }

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado' });
  }

  const isPasswordValid = await bcrypt.compare(senha, user.senha);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

  return res.json({ token });
};

const getProfile = (req, res) => {
  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const { senha, ...userData } = user;
  return res.json(userData);
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
