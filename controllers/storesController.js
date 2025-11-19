const sql = require('mssql');
const dbconfig = require('../db/dbconfig');

async function getStoreByStoreNumber(req, res) {

  sql.connect(dbconfig)
    .then(async pool => {
      try {
        const { search } = req.params;
        const { offset = 0, limit = 20 } = req.query;

        let where = "";
        const request = pool.request();

        // Si viene search → agregamos WHERE y parámetro
        if (search && search.trim() !== "") {
          where = " WHERE sucursal = @search ";
          request.input('search', sql.VarChar, search);
        }

        // 1. Total de resultados
        const totalQuery = `
          SELECT COUNT(*) AS totalCount
          FROM SucursalesTodas suc
          ${where};
        `;

        const totalResult = await request.query(totalQuery);
        const totalCount = totalResult.recordset[0]?.totalCount || 0;

        // 2. Consulta principal
        const query = `
          SELECT 
            sucursal,NomSucursal,Direccion,Cuit,NombreEmpresa,CodigoPostal,Cajas,PDVF,Server,Alias,FechaApertura,FechaAlta,FechaPrimerCierre,
            FechaUltimaModificacion,Region,Estado,Vinculo,AnchoBanda,SGP,Fibra,CTX,Telefono,AFIP,CodGrupo,idCiudad,EsCentroDistribucion,
            TipoRelacion,EntreCalles,NroSucursal,IdRazonSocial,IdCDRegion,EsCapital
          FROM SucursalesTodas
          ${where}
          ORDER BY sucursal
          OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
        `;

        request
          .input('offset', sql.Int, Number(offset))
          .input('limit', sql.Int, Number(limit));

        const result = await request.query(query);

        return res.json({
          totalCount,
          offset: Number(offset),
          limit: Number(limit),
          results: result.recordset
        });

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener la tienda' });
      }
    })
    .catch(err => {
      console.error("Error SQL:", err);
      return res.status(500).json({ error: "Error de conexión con la base de datos" });
    });
};

module.exports = {
  getStoreByStoreNumber
};
