var app = angular.module('simulation', []);

var MAX_PRICE = 100000000;
var MAX_ANNUAL_INCOME = 20000000;
var UNIT_TEN_THOUSAND = 10000;
Number.isFinite = Number.isFinite || function(any) {
    return typeof any === 'number' && isFinite(any);
};
Number.isNaN = Number.isNaN || function(any) {
    return typeof any === 'number' && isNaN(any);
};
app.controller('simulationTest', function($scope, $filter) {
    function init() {
        $scope.myTest = 0;
        $scope.myTestDisplay = 0;
    }

    function filterNumber(iiv) {
        return $filter('number')(iiv);
    }

    function division10000AndNumberFilter(iv) {
        var iiv = Math.floor(iv/UNIT_TEN_THOUSAND);
        return filterNumber(iiv);
    }

    function deleteCommaToInteger(v) {
        var cv = v.replace(/[,A-z]/g, '');
        return parseInt(cv);
    }

    function displayValue(iv) {
        if (Number.isNaN(iv)) {
            return '0';
        }
        if (UNIT_TEN_THOUSAND < iv) {
            return '10,000';
        }
        return iv;
    }

    function numericValue(iv) {
        if (Number.isNaN(iv)) {
            return;
        }
        if (UNIT_TEN_THOUSAND < iv) {
            return MAX_PRICE;
        }
        return iv * UNIT_TEN_THOUSAND;
    }

    $scope.$watch('myTest', function(v, old){
        var iv = parseInt(v);
        $scope.myTest = iv;
        $scope.myTestDisplay = division10000AndNumberFilter(iv);
    });

    $scope.$watch('myTestDisplay', function(v, old) {
        var cv = deleteCommaToInteger(v.toString());
        $scope.myTestDisplay = filterNumber(displayValue(cv));
        $scope.myTest = numericValue(cv);
    });

    init();
});

app.directive('myDirective', ['$timeout', '$interval', function($timeout, $interval) {
    function setScopeValues(scope, attrs) {
        scope.min = attrs.min || 0;
        scope.max = attrs.max || 0;
        scope.value = attrs.value || 0;
    }

    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            ngModel: '=',
            ngModelDisplay: '='
        },
        template:
        '<div class="col-sm-12">' +
        '   <input type="text" ng-model="ngModelDisplay">' +
        '</div>' +
        '<div class="col-sm-12">' +
        '       <input type="range" value="{{value}}" class="form-control" min="{{min}}" max="{{max}}" ng-model="ngModel">' +
        '</div>',
        transclude: true,
        link: function(scope, element, attrs, ngModel) {
            setScopeValues(scope, attrs);

            $timeout(function() {
                if (scope.value === attrs.value) {
                    ngModel.$setViewValue(scope.value);
                }
            });
        }
    }
}]);