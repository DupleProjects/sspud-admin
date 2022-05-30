export default {
    methods: {
        evaluateProperty(stagedProduct, propertyValue, noGoValues) {
            return noGoValues.indexOf(propertyValue) > -1;
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
            const validHeight =  this.evaluateProperty(product, product.shippingHeight, ['', null]);
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
            return validName &&
                validDescription &&
                validPrice &&
                validWeight &&
                validHeight &&
                validLength &&
                validWidth &&
                validStock &&
                validCategory &&
                validSubCategory &&
                validBrand;

        }
    }
}
