import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.access_token //pegando o cookie com o token
        if(!token){return res.status(401).json({sucess: false, msg: "Acesso negado"})}
    
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if(err){ return res.status(403).json({sucess: false, msg: "Token inválido"})}
            req.user = user; //user é o id que está dentro do token //Será usado para verificar se o cookie pertence ao dono da request

            if(user.id !== req.body.userID){
                return res.status(401).json({sucess: false, msg: "Você só pode alterar sua própria conta"})
            }

            next()

            // return res.status(200).json({cookieID: user.id, userID: req.body.userID})
        })
    } catch (error) {
        return res.status(401).json({sucess: false, msg: "Erro na verificação do token"})
    }
}