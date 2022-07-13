const connection = require('../connection');

const list = async (req, res) => {
    const { user } = req;
    let { category, startprice, endprice } = req.query;

    let filterControl = '0';
    if (category) {
        filterControl = '1';
    };
    if (startprice && Number(startprice) && Number.isInteger(Number(startprice))) {
        startprice = Number(startprice);
        filterControl = filterControl + '1';
    } else {
        filterControl = filterControl + '0';
    };
    if (endprice && Number(endprice) && Number.isInteger(Number(endprice))) {
        endprice = Number(endprice);
        filterControl = filterControl + '1';
    } else {
        filterControl = filterControl + '0';
    };

    try {
        let products;
        let query;
        switch (filterControl) {
            case '000': // Sem filtro
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 ORDER BY categoria, nome';
                products = await connection.query(query, [user.id]);
                break;
            case '001': // Filtro por preço máximo
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 and preco <= $2 ORDER BY preco, nome';
                products = await connection.query(query, [user.id, endprice]);
                break;
            case '010': // Filtro por preço mínimo
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 and preco >= $2 ORDER BY nome';
                products = await connection.query(query, [user.id, startprice]);
                break;
            case '011': // Filtro por preço mínimo e máximo
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 and preco >= $2 and preco <= $3 ORDER BY nome';
                products = await connection.query(query, [user.id, startprice, endprice]);
                break;
            case '100': // Filtro por categoria
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 and categoria = $2 ORDER BY nome';
                products = await connection.query(query, [user.id, category.toLowerCase()]);
                break;
            case '101': // Filtro por categoria e preço máximo
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 and categoria = $2 and preco <= $3 ORDER BY nome';
                products = await connection.query(query, [user.id, category.toLowerCase(), endprice]);
                break;
            case '110': // Filtro por categoria e preço mínimo
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 and categoria = $2 and preco >= $3 ORDER BY nome';
                products = await connection.query(query, [user.id, category.toLowerCase(), startprice]);
                break;
            case '111': // Filtro por categoria, preço mínimo e preço máximo
                query = 'SELECT * FROM produtos WHERE usuario_id = $1 and categoria = $2 and preco >= $3 and preco <= $4 ORDER BY nome';
                products = await connection.query(query, [user.id, category.toLowerCase(), startprice, endprice]);
                break;
            default:
                break;
        }

        if (products.rowCount === 0) {
            return res.status(400).json(`Não existem produtos cadastrados para esse usuário ${filterControl !== '000' && ' com o(s) filtro(s) informado(s)'}!`);
        }

        return res.status(200).json(products.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const get = async (req, res) => {
    const { user } = req;
    const { id: productId } = req.params;

    try {
        let query = 'SELECT * FROM produtos WHERE usuario_id = $1 and id = $2;';
        const product = await connection.query(query, [user.id, productId]);

        if (product.rowCount === 0) {
            return res.status(400).json('Não existe produto cadastrado para esse usuário com o id informado!');
        }

        return res.status(200).json(product.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const add = async (req, res) => {
    const { user } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(400).json("O campo <nome do produto> é obrigatório.");
    }

    if (!estoque) {
        return res.status(400).json("O campo <estoque> é obrigatório.");
    }

    if (!preco) {
        return res.status(400).json("O campo <preço> é obrigatório.");
    }

    if (!Number.isInteger(preco) || typeof preco === 'string') {
        return res.status(400).json("O campo <preço> deve ser informado em centavos (número inteiro).");
    }

    if (!descricao) {
        return res.status(400).json("O campo <descrição> é obrigatório.");
    }

    try {
        let query = 'SELECT * FROM produtos WHERE nome = $1 and usuario_id = $2';
        const productValidation = await connection.query(query, [nome.toLowerCase(), user.id]);

        if (productValidation.rowCount > 0) {
            return res.status(400).json('Produto já cadastrado!');
        }

        query = `INSERT INTO produtos
                (nome, estoque, preco, categoria, descricao, imagem, usuario_id)
                VALUES($1, $2, $3, $4, $5, $6, $7)`;
        const addedProduct = await connection.query(query,
            [nome.toLowerCase(), estoque, preco, categoria.toLowerCase(), descricao, imagem, user.id]);

        if (addedProduct.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o produto.');
        }

        return res.status(200).json('Produto cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const edit = async (req, res) => {
    const { user } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;
    const { id: productId } = req.params;

    if (!nome) {
        return res.status(400).json("O campo <nome do produto> é obrigatório.");
    }

    if (!estoque) {
        return res.status(400).json("O campo <estoque> é obrigatório.");
    }

    if (!preco) {
        return res.status(400).json("O campo <preco> é obrigatório.");
    }

    if (!Number.isInteger(preco) || typeof preco === 'string') {
        return res.status(400).json("O campo <preço> deve ser informado em centavos (número inteiro).");
    }

    if (!descricao) {
        return res.status(400).json("O campo <descrição> é obrigatório.");
    }

    try {
        let query = 'SELECT * FROM produtos WHERE id = $1 and usuario_id = $2';
        const productValidation = await connection.query(query, [productId, user.id]);

        if (productValidation.rowCount === 0) {
            return res.status(400).json('Produto informado não consta no cadastro do usuário!');
        }

        query = `UPDATE produtos
                SET nome = $1,
                estoque = $2,
                preco = $3,
                categoria = $4,
                descricao = $5,
                imagem = $6
                WHERE id = $7`;
        const updatedProduct = await connection.query(query,
            [nome.toLowerCase(), estoque, preco, categoria.toLowerCase(), descricao, imagem, productId]);

        if (updatedProduct.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar o produto.');
        }

        return res.status(200).json('Produto atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const remove = async (req, res) => {
    const { user } = req;
    const { id: productId } = req.params;

    try {
        let query = 'SELECT * FROM produtos WHERE id = $1 and usuario_id = $2';
        const productValidation = await connection.query(query, [productId, user.id]);

        if (productValidation.rowCount === 0) {
            return res.status(400).json('Produto informado não consta no cadastro do usuário!');
        }

        query = 'DELETE FROM produtos WHERE id = $1';
        const removedProduct = await connection.query(query, [productId]);

        if (removedProduct.rowCount === 0) {
            return res.status(400).json('Não foi possível remover o produto.');
        }

        return res.status(200).json('Produto removido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    list,
    get,
    add,
    edit,
    remove
}