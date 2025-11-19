exports.getPromoBySku = async (req, res) => {
 
  const { sku, store, start, end, offset, max } = req.params;
  const startDate = start;
  const endDate = end;
 
  // VALIDAR HEADER
  const country = req.headers['f-country'];
  if (!country) {
    return res.status(400).json({ error: "Header F-Country es obligatorio." });
  }
  if (country !== "UY") {
    return res.status(400).json({ error: "F-Country debe ser UY." });
  }

  // Validación de parámetros obligatorios
  if (!sku || !store || !startDate || !endDate || !offset || !max) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  // Valores permitidos
  const validSkus = ["5544", "3245", "11970", "11971", "14806", "14807"];
  const validStores = ["T004", "T006"];

  // Validar SKU
  if (!validSkus.includes(sku)) {
    return res.status(200).json([]);  // SKU inválido → array vacío
  }

  // Validar Store
  if (!validStores.includes(store)) {
    return res.status(200).json([]);  // Store inválida → array vacío
  }

  // Listas de tipos de promoción
  const skus2x1 = ["5544", "3245"];
  const skus30o = ["11970", "11971"];
  const skus2da70o = ["14806", "14807"];

  let data = [];

  // -----------------------------
  //      PROMO 2x1
  // -----------------------------
  if (skus2x1.includes(sku)) {
    data = [{
      name: "2x1 - Farmacity Test",
      startDate: "2025-11-01",
      endDate: "2026-11-01",
      frequency: [],
      stores: [store],
      active: true,
      createdBy: "l_caleffa",
      updatedBy: "l_caleffa",
      createdAt: "2025-11-01",
      lastUpdate: "2025-11-19",

      campaign: {
        id: "32defgrtycv43fdr322sd3",
        companyId: "FCITY",
        description: "Campaña de prueba 2025",
        startDate: "2025-11-01",
        endDate: "2030-11-30",
        name: "Campaña de prueba 2025",
        isActive: true
      },

      conditionBarcode: ["7790010570626","77986351","77903785"],
      conditionBarcodeComparator: "into",
      conditionSKU: [sku],
      conditionSkuComparator: "into",
      conditionDepartment: [],
      conditionDepartmentComparator: "into",
      conditionCategory: [],
      conditionCategoryComparator: "into",
      conditionSubCategory: [],
      conditionSubCategoryComparator: "into",
      conditionBrand: [],
      conditionBrandComparator: "into",
      conditionSupplier: [],
      conditionSupplierComparator: "into",
      conditionCoupon: [],
      conditionCouponComparator: "into",
      conditionFormat: [],
      conditionFormatComparator: "into",
      conditionZone: [],
      conditionZoneComparator: "into",

      comboComponentsMax: 2,
      benefitsMaxApplicationValue: 1,
      aplicationBenefit: [sku],
      benefitClassField: [],
      discountPercentage: 100,
      newPrice: 0
    }];
  }

  // -----------------------------
  //      PROMO 30% OFF
  // -----------------------------
  else if (skus30o.includes(sku)) {
    data = [{
      name: "30 % EN LA UNIDAD - Farmacity Test",
      startDate: "2025-11-01",
      endDate: "2026-11-01",
      frequency: [],
      stores: [store],
      active: true,
      createdBy: "l_caleffa",
      updatedBy: "l_caleffa",
      createdAt: "2025-11-01",
      lastUpdate: "2025-11-19",

      campaign: {
        id: "32defgrtycv43fdr322sd3",
        companyId: "FCITY",
        description: "Campaña de prueba 2025",
        startDate: "2025-11-01",
        endDate: "2030-11-30",
        name: "Campaña de prueba 2025",
        isActive: true
      },

      conditionBarcode: ["7730197301958","7730197000622"],
      conditionBarcodeComparator: "into",
      conditionSKU: [sku],
      conditionSkuComparator: "into",
      conditionDepartment: [],
      conditionDepartmentComparator: "into",
      conditionCategory: [],
      conditionCategoryComparator: "into",
      conditionSubCategory: [],
      conditionSubCategoryComparator: "into",
      conditionBrand: [],
      conditionBrandComparator: "into",
      conditionSupplier: [],
      conditionSupplierComparator: "into",
      conditionCoupon: [],
      conditionCouponComparator: "into",
      conditionFormat: [],
      conditionFormatComparator: "into",
      conditionZone: [],
      conditionZoneComparator: "into",

      comboComponentsMax: 1,
      benefitsMaxApplicationValue: 1,
      aplicationBenefit: [sku],
      benefitClassField: [],
      discountPercentage: 30,
      newPrice: 0
    }];
  }

  // -----------------------------
  //   PROMO 70% EN 2º UNIDAD
  // -----------------------------
  else if (skus2da70o.includes(sku)) {
    data = [{
      name: "70% EN LA SEGUNADA UNIDAD - Farmacity Test",
      startDate: "2025-11-01",
      endDate: "2026-11-01",
      frequency: [],
      stores: [store],
      active: true,
      createdBy: "l_caleffa",
      updatedBy: "l_caleffa",
      createdAt: "2025-11-01",
      lastUpdate: "2025-11-19",

      campaign: {
        id: "32defgrtycv43fdr322sd3",
        companyId: "FCITY",
        description: "Campaña de prueba 2025",
        startDate: "2025-11-01",
        endDate: "2030-11-30",
        name: "Campaña de prueba 2025",
        isActive: true
      },

      conditionBarcode: ["7736550004535","7891000419076"],
      conditionBarcodeComparator: "into",
      conditionSKU: [sku],
      conditionSkuComparator: "into",
      conditionDepartment: [],
      conditionDepartmentComparator: "into",
      conditionCategory: [],
      conditionCategoryComparator: "into",
      conditionSubCategory: [],
      conditionSubCategoryComparator: "into",
      conditionBrand: [],
      conditionBrandComparator: "into",
      conditionSupplier: [],
      conditionSupplierComparator: "into",
      conditionCoupon: [],
      conditionCouponComparator: "into",
      conditionFormat: [],
      conditionFormatComparator: "into",
      conditionZone: [],
      conditionZoneComparator: "into",

      comboComponentsMax: 2,
      benefitsMaxApplicationValue: 1,
      aplicationBenefit: [sku],
      benefitClassField: [],
      discountPercentage: 70,
      newPrice: 0
    }];
  }

  // -----------------------------
  //   RESPUESTA FINAL
  // -----------------------------
  return res.json({
    offset: Number(offset),
    max: Number(max),
    total: data.length,
    results: data
  });

};
