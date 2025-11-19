const sql = require('mssql');
const dbconfig = require('../db/dbconfig');

async function getItemsByDescription(req, res) {

  sql.connect(dbconfig)
    .then(async pool => {
      try {
        const { search } = req.params;
        const { offset = 0, limit = 20 } = req.query; // paginación opcional desde query

        if (!search) {
          return res.status(400).json({ error: 'El campo "search" es obligatorio.' });
        }

        // WHERE básico
        const where = "art.Descripcion LIKE '%' + @search + '%' AND art.Estado = 'A'";
        const request = pool.request().input('search', sql.VarChar, search);

        // 1. Total de resultados
        const totalQuery = `
          SELECT COUNT(*) AS totalCount
          FROM Articulo art
          WHERE ${where};
        `;
        const totalResult = await request.query(totalQuery);
        const totalCount = totalResult.recordset[0]?.totalCount || 0;

        // 2. Consulta principal
        const query = `
          SELECT 
              art.cuf,
              art.descripcion,
              art.estado,
              art.PrecioPublico,
              art.IdDepartamento AS departmentId,
              art.Departamento AS departmentCode,
              dep.Descripcion AS department,
              art.IdCategoria AS categoryId,
              art.Categoria AS categoryCode,
              cat.Descripcion AS category,
              art.IdSubCategoria AS subCategoryId,
              art.Subcategoria AS subCategoryCode,
              scat.Descripcion AS subCategory,
              art.IdProveedor AS supplierId,
              art.Proveedor AS supplierCode,
              pro.Nombre AS supplier,
              art.IdMarca AS brandId,
              art.Marca AS brandCode,
              mar.Descripcion AS brand,
              art.CodBarra AS barcode,
              ISNULL((
                  SELECT cr2.CodBarra
                  FROM CUFRelacion cr2
                  WHERE cr2.cuf = art.cuf 
                    AND cr2.activo = 1
                  FOR JSON PATH
              ), '[]') AS CodBarra,
              art.CodIva AS taxCode
          FROM Articulo art
          LEFT JOIN Departamento dep ON dep.IdDepartamento = art.IdDepartamento
          LEFT JOIN Categoria cat ON cat.IdCategoria = art.IdCategoria
          LEFT JOIN Subcategoria scat ON scat.IdSubCategoria = art.IdSubCategoria
          LEFT JOIN Proveedor pro ON pro.IdProveedor = art.IdProveedor
          LEFT JOIN Marca mar ON mar.IdMarca = art.IdMarca
          WHERE ${where}
          ORDER BY art.descripcion
          OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
        `;

        const result = await request
          .input('offset', sql.Int, Number(offset))
          .input('limit', sql.Int, Number(limit))
          .query(query);

        // Parsear barcodes
        const data = result.recordset.map(row => {
          let barcodes;
          try {
            barcodes = JSON.parse(row.CodBarra || '[]').map(x => x.CodBarra);
          } catch {
            barcodes = [];
          }

          return {
            sku: row.cuf,
            description: row.descripcion,
            status: row.estado,
            price: row.PrecioPublico,
            barcode: row.barcode,
            barcodes,
            departmentId: row.departmentId,
            departmentCode: row.departmentCode,
            department: row.department,
            categoryId: row.categoryId,
            categoryCode: row.categoryCode,
            category: row.category,
            subCategoryId: row.subCategoryId,
            subCategoryCode: row.subCategoryCode,
            subCategory: row.subCategory,
            supplierId: row.supplierId,
            supplierCode: row.supplierCode,
            supplier: row.supplier,
            brandId: row.brandId,
            brandCode: row.brandCode,
            brand: row.brand,
            taxCode: row.taxCode
          };
        });

        // 👌 RESPUESTA FINAL ÚNICA
        return res.json({
          totalCount,
          offset: Number(offset),
          limit: Number(limit),
          results: data
        });

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener artículos' });
      }
    })
    .catch(err => {
      console.error("Error SQL:", err);
      return res.status(500).json({ error: "Error de conexión con la base de datos" });
    });
};

module.exports = {
  getItemsByDescription
};