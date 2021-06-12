var app = angular.module('groceryApp', ['ngRoute'])

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'views/groceryList.html',
            controller: 'GroceryListItemsController'
        })
        .when('/input-item', {
            templateUrl: 'views/inputItem.html',
            controller: 'GroceryListItemsController'
        })
        .when('/input-item/edit/:id', {
            templateUrl: 'views/inputItem.html',
            controller: 'GroceryListItemsController'
        })
        .when('/not-found', {
            templateUrl: 'views/notFound.html'
        })
        .otherwise({
            redirectTo: '/not-found'
        })
})

app.controller('HomeController', ['$scope', 'GroceryService', function ($scope, GroceryService) {
    $scope.groceryItems = GroceryService.groceryItems;
}])

app.service('GroceryService', function () {

    var groceryService = {};

    groceryService.groceryItems = [
        {id: 1, completed: false, itemName: 'milk', date: '2021-5-01'},
        {id: 2, completed: false, itemName: 'cookies', date: '2021-5-01'},
        {id: 3, completed: false, itemName: 'ice cream', date: '2021-5-01'},
        {id: 4, completed: false, itemName: 'potatoes', date: '2021-5-01'},
        {id: 5, completed: false, itemName: 'cereal', date: '2021-5-01'},
        {id: 6, completed: false, itemName: 'bread', date: '2021-5-01'},
    ]

    groceryService.findById = function (id) {
        for (var item in groceryService.groceryItems) {
            if (groceryService.groceryItems[item].id === id) {
                return groceryService.groceryItems[item];
            }
        }
    }

    groceryService.getNewId = function () {
        if (groceryService.newId) {
            groceryService.newId++;
            return groceryService.newId;
        } else {
            var maxId = _.max(groceryService.groceryItems, function (entry) {
                return entry.id
            })
            groceryService.newId = maxId.id + 1;
            return groceryService.newId;
        }
    }

    groceryService.save = function (entry) {
        if (entry.id === null) {
            entry.id = groceryService.getNewId();
            groceryService.groceryItems.push(entry);
        } else {
            for (var item in groceryService.groceryItems) {
                if (groceryService.groceryItems[item].id === entry.id) {
                    groceryService.groceryItems[item] = entry;
                    return
                }
            }
        }
    }

    return groceryService;
})

app.controller('GroceryListItemsController', ['$scope', '$routeParams', '$location', 'GroceryService', function ($scope, $routeParams, $location, GroceryService) {
    $scope.modeTitle = $routeParams.id ? 'Edit' : 'Add';

    if (!$routeParams.id) {
        $scope.groceryItem = {id: null, completed: false, itemName: '', date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`};
    } else {
        $scope.groceryItem = GroceryService.findById(parseInt($routeParams.id));
        if($scope.groceryItem === undefined) {
            $location.path('/');
        }
    }

    $scope.save = function () {
        GroceryService.save( $scope.groceryItem );
        $location.path('/');
    }

    console.log($scope.groceryItems)
}])
