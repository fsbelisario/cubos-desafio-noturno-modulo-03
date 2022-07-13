const connection = require('../connection');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const pwd = securePassword();

const enroll = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(400).json("O campo <nome> é obrigatório.");
    }

    if (!nome_loja) {
        return res.status(400).json("O campo <nome da loja> é obrigatório.");
    }

    if (!email) {
        return res.status(400).json("O campo <e-mail> é obrigatório.");
    }

    if (!senha) {
        return res.status(400).json("O campo <senha> é obrigatório.");
    }

    try {
        let query = 'SELECT * FROM usuarios WHERE email = $1';
        const userValidation = await connection.query(query, [email.toLowerCase()]);

        if (userValidation.rowCount > 0) {
            return res.status(400).json('E-mail já cadastrado!');
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

        query = 'INSERT INTO usuarios (nome, nome_loja, email, senha) VALUES ($1, $2, $3, $4)';
        const enrolledUser = await connection.query(query, [nome, nome_loja, email.toLowerCase(), hash]);

        if (enrolledUser.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json("O campo e-mail é obrigatório.");
    }

    if (!senha) {
        return res.status(400).json("O campo senha é obrigatório.");
    }

    try {
        let query = 'SELECT * FROM usuarios WHERE email = $1';
        const userValidation = await connection.query(query, [email.toLowerCase()]);

        if (userValidation.rowCount === 0) {
            return res.status(400).json('E-mail ou senha inválidos!');
        }

        const { senha: password, ...user } = userValidation.rows[0];

        const pwdResult = await pwd.verify(Buffer.from(senha), Buffer.from(password, 'hex'));

        switch (pwdResult) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('E-mail ou senha inválidos!');
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

                    query = 'UPDATE usuarios SET senha = $1 WHERE email = $2';
                    await connection.query(query, [hash, email.toLowerCase()]);
                } catch {
                }
                break;
        }

        const token = jwt.sign({
            id: user.id,
            name: user.nome,
            email: user.email,
            nome_loja: user.nome_loja,
        }, jwtSecret);

        return res.status(200).json({ message: `Login realizado com sucesso pelo usuário <${user.nome}>.`, user, token });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const getProfile = async (req, res) => {
    const { user } = req;

    try {
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const editProfile = async (req, res) => {
    const { user } = req;
    const { nome, email, senha, nome_loja } = req.body;

    let userDataFields;

    if (!nome) {
        userDataFields = '0';
    } else {
        userDataFields = '1';
    };

    if (!nome_loja) {
        userDataFields = userDataFields + '0';
    } else {
        userDataFields = userDataFields + '1';
    };

    if (!email) {
        userDataFields = userDataFields + '0';
    } else {
        userDataFields = userDataFields + '1';
    };

    if (!senha) {
        userDataFields = userDataFields + '0';
    } else {
        userDataFields = userDataFields + '1';
    };

    if (userDataFields !== '0000') {
        try {
            if (!email && email.toLowerCase() !== user.email) {
                let query = 'SELECT * FROM usuarios WHERE email = $1';
                const userValidation = await connection.query(query, [email.toLowerCase()]);

                if (userValidation.rowCount > 0) {
                    return res.status(400).json('E-mail informado já cadastrado para outro usuário!');
                }
            }

            let hash;
            if (!senha) {
                hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
            }

            let updatedUser
            switch (userDataFields) {
                case '0001':
                    query = 'UPDATE usuarios SET senha = $1 WHERE id = $2';
                    updatedUser = await connection.query(query, [hash, user.id]);
                    break;
                case '0010':
                    query = 'UPDATE usuarios SET email = $1 WHERE id = $2';
                    updatedUser = await connection.query(query, [email.toLowerCase(), user.id]);
                    break;
                case '0011':
                    query = 'UPDATE usuarios SET email = $1, senha = $2 WHERE id = $3';
                    updatedUser = await connection.query(query, [email.toLowerCase(), hash, user.id]);
                    break;
                case '0100':
                    query = 'UPDATE usuarios SET nome_loja = $1 WHERE id = $2';
                    updatedUser = await connection.query(query, [nome_loja, user.id]);
                    break;
                case '0101':
                    query = 'UPDATE usuarios SET nome_loja = $1, senha = $2 WHERE id = $3';
                    updatedUser = await connection.query(query, [nome_loja, hash, user.id]);
                    break;
                case '0110':
                    query = 'UPDATE usuarios SET nome_loja = $1, email = $2 WHERE id = $3';
                    updatedUser = await connection.query(query, [nome_loja, email.toLowerCase(), user.id]);
                    break;
                case '0111':
                    query = 'UPDATE usuarios SET nome_loja = $1, email = $2, senha = $3 WHERE id = $4';
                    updatedUser = await connection.query(query, [nome_loja, email.toLowerCase(), hash, user.id]);
                    break;
                case '1000':
                    query = 'UPDATE usuarios SET nome = $1 WHERE id = $2';
                    updatedUser = await connection.query(query, [nome, user.id]);
                    break;
                case '1001':
                    query = 'UPDATE usuarios SET nome = $1, senha = $2 WHERE id = $3';
                    updatedUser = await connection.query(query, [nome, hash, user.id]);
                    break;
                case '1010':
                    query = 'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3';
                    updatedUser = await connection.query(query, [nome, email.toLowerCase(), user.id]);
                    break;
                case '1011':
                    query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4';
                    updatedUser = await connection.query(query, [nome, email.toLowerCase(), hash, user.id]);
                    break;
                case '1100':
                    query = 'UPDATE usuarios SET nome = $1, nome_loja = $2 WHERE id = $3';
                    updatedUser = await connection.query(query, [nome, nome_loja, user.id]);
                    break;
                case '1101':
                    query = 'UPDATE usuarios SET nome = $1, nome_loja = $2, senha = $3 WHERE id = $4';
                    updatedUser = await connection.query(query, [nome, nome_loja, hash, user.id]);
                    break;
                case '1110':
                    query = 'UPDATE usuarios SET nome = $1, nome_loja = $2, email = $3 WHERE id = $4';
                    updatedUser = await connection.query(query, [nome, nome_loja, email.toLowerCase(), user.id]);
                    break;
                case '1111':
                    query = 'UPDATE usuarios SET nome = $1, nome_loja = $2, email = $3, senha = $4 WHERE id = $5';
                    updatedUser = await connection.query(query, [nome, nome_loja, email.toLowerCase(), hash, user.id]);
                    break;
                default:
                    break;
            };

            if (updatedUser.rowCount === 0) {
                return res.status(400).json('Não foi possível atualizar o perfil do usuário.');
            }

            return res.status(200).json('Perfil do usuário atualizado com sucesso.');
        } catch (error) {
            return res.status(400).json(error.message);
        };
    };
};

module.exports = {
    enroll,
    login,
    getProfile,
    editProfile
}