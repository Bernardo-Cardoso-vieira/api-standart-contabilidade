export default function autorizar(...rolesPermitidos) {
  return function (req, res, next) {
    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }
    next();
  };
}
