import './shopping-product.html';

Template.shoppingProduct.helpers({

pathForPost(){
    var product = this;
    var params = {
        product: product.productName,
    };
    var queryParams = {page:1};
    var routeName = "blogPost";
    var path = FlowRouter.path(routeName, params, queryParams);

    return path;
    }
});
