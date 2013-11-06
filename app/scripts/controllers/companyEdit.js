'use strict';

angular.module('nhvioApp')
  .controller('CompanyEditCtrl', ['$scope', '$routeParams', '$window', 'UserService', 'CompanyService', 'LanguageService', function ($scope, $routeParams, $window, UserService, CompanyService, LanguageService) {

    // Note that, here we've got a callback on the promise instead
    // of directly using the value of the promise because we'd like
    // to enable two-way binding in the user-edit form.
    var wasNewlyRegistered = false;
    if (typeof $routeParams.companyId !== 'undefined') {
      CompanyService.getCompany($routeParams.companyId).then(function(company){
        $scope.company = company;
      });
    }else{
      $scope.company = {isNew: true, languages: []};
    };

    LanguageService.getLanguages().then(function(languages){
      $scope.programmingLanguages = languages;
      console.log(languages);
    });


    $scope.range = function(min, max, step){
      step = (step == undefined) ? 1 : step;
      var input = [];
      for (var i=min; i<=max; i+=step){
        input.push(i);
      }
      return input;
    };
    $scope.logCompany = function(){
      console.log($scope.company);
    }

    // Remove the current user
    $scope.remove = function(){
      console.log("Deleting company", $scope.company);
      $scope.submitting = true;
      $scope.company.remove().then(function(){
        $scope.submitting = false;

        // Remove company from current scope,
        // clear our cache of companys in the
        // companyService.  Redirect to the 
        // list of companys.
        $scope.company = null;
        CompanyService.clearAll();
        $window.location.href = '/developers';
      }, function(response) {
        $scope.submitting = false;
        alert('Error removing company!');
      })
    }

    // Save the current company
    $scope.put = function(){
      console.log("submitting", $scope.company);
      $scope.submitting = true;
      if ($scope.company.isNew) {
        CompanyService.createCompany($scope.company).then(function(){
          $scope.submitting = false;
        }, function(response) {
          $scope.submitting = false;
          alert('Error saving!');
        })

      }else{
        $scope.company.put().then(function(){
          $scope.submitting = false;
        }, function(response) {
          $scope.submitting = false;
          alert('Error saving!');
        })
      }
    }
  }]);
