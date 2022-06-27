export default {
    methods: {
        evaluateProperty(stagedProduct, propertyValue, noGoValues) {
            return noGoValues.indexOf(propertyValue) === -1;
        },
        evaluateProduct(product) {
            // We have to evaluate each field
            // Name
            const validName = this.evaluateProperty(product, product.name, ['', null]);
            // Description
            const validDescription = this.evaluateProperty(product, product.description, ['', null]);
            // Price
            const validPrice = this.evaluateProperty(product, product.price, ['', null]);
            // Shipping weight
            const validWeight = this.evaluateProperty(product, product.shippingWeight, ['', null]);
            // Shipping height
            const validHeight = this.evaluateProperty(product, product.shippingHeight, ['', null]);
            // Shipping length
            const validLength = this.evaluateProperty(product, product.shippingLength, ['', null]);
            // Shipping width
            const validWidth = this.evaluateProperty(product, product.shippingWidth, ['', null]);
            // Has stock
            const validStock = this.evaluateProperty(product, product.hasStock, [0, false, null]);
            // Has category
            const validCategory = this.evaluateProperty(product, product.categoryId, [0, false, null]);
            // Has sub category
            const validSubCategory = this.evaluateProperty(product, product.subCategoryId, [0, false, null]);
            // Has brand
            const validBrand = this.evaluateProperty(product, product.brandId, [0, false, null]);

            const productDetails = {
                validName: validName,
                validWeight: validWeight,
                validDescription: validDescription,
                validHeight: validHeight,
                validLength: validLength,
                validWidth: validWidth,
                // validStock: validStock,
                validCategory: validCategory,
                validSubCategory: validSubCategory,
                validBrand: validBrand,
                validPrice: validPrice
            }
            // console.log('validName', validName)
            // console.log('validDescription', validDescription)
            // console.log('validWeight', validWeight)
            // console.log('validHeight', validHeight)
            // console.log('validLength', validLength)
            // console.log('validWidth', validWidth)
            // console.log('validStock', validStock)
            // console.log('validCategory', validCategory)
            // console.log('validSubCategory', validSubCategory)
            // console.log('validBrand', validBrand)

            if(validName && validDescription && validPrice && validWeight && validHeight && validLength && validWidth && validCategory && validSubCategory && validBrand){
                var isValidCheck = true
            }else{
                var isValidCheck = false
            }
            return {
                isValidProduct: isValidCheck,
                productValidDetails: productDetails,
            }

        },
        canPublishProduct(product, certificates) {
            // First check if fields are valid
            const validProduct = this.evaluateProduct(product);

            // Check if all necessary certificates are present
            let validCertificates = false;
            if (product.certificateRequired) {
                if (certificates.length > 0) {
                    validCertificates = true;
                }
            } else {
                validCertificates = true;
            }
            validProduct.productValidDetails.validCertificates = validCertificates
            if(validProduct.isValidProduct && validCertificates){
                var finalValidCheck = true
            }else{
                var finalValidCheck = false
            }
            // If everything checks out we can publish
            return {
                   isValidProduct: finalValidCheck,
                   productDetails: validProduct.productValidDetails,
            };
        },
        createProductLogForProperty(product, originalProduct, property, logs, isNumber) {
            // Check if there is any difference between original and saved product
            if (isNumber) {
                product[property] = Number(product[property])
            }
            // Check each relevant property
            if (product[property] !== originalProduct[property]) {
                const newLog = {
                    stagedProductId: product.id,
                    property,
                    fromValue: originalProduct[property],
                    toValue: product[property]
                }
                logs.push(newLog);
            }
        },
        createProductLogs(product, originalProduct) {
            // Check if there is any difference between original and saved product
            const logs = [];
            // Check each relevant property
            // Name
            this.createProductLogForProperty(product, originalProduct, 'name', logs);
            // Description
            this.createProductLogForProperty(product, originalProduct, 'description', logs);
            // Category id
            this.createProductLogForProperty(product, originalProduct, 'categoryId', logs);
            // Sub Category id
            this.createProductLogForProperty(product, originalProduct, 'subCategoryId', logs);
            // brand id
            this.createProductLogForProperty(product, originalProduct, 'brandId', logs);
            // shippingLength
            this.createProductLogForProperty(product, originalProduct, 'shippingLength', logs, true);
            // shippingHeight
            this.createProductLogForProperty(product, originalProduct, 'shippingHeight', logs, true);
            // shippingWidth
            this.createProductLogForProperty(product, originalProduct, 'shippingWidth', logs, true);
            // shippingWeight
            this.createProductLogForProperty(product, originalProduct, 'shippingWeight', logs, true);
            return logs;
        }
    }
}
