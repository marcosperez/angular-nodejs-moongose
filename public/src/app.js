(function(){

	var app =angular.module('app', ['ngRoute','ui.bootstrap','ui.sortable']);

	app.directive('ngNav',function(){
		return {
			restrict: 'E',
			templateUrl: '/src/views/nav.html',
			controller: ['$scope','$log','$rootScope', function($scope, $log,$rootScope ){
				this.tab=1;

				this.setTab = function(tab){
					this.tab=tab;
					$rootScope.$broadcast('manu_item',tab);
					//$log.log("Selecciono: "+tab)
				};

				this.selectTab = function(valor){
					return valor===this.tab;
	
				};


			}],
			controllerAs: 'navCtrl'	};
	});


	app.directive('ngNotas',function(){
		return {
			restrict: 'E',
			templateUrl: '/src/views/notas.html',
			controller:['$rootScope','$log' ,'$modal','$scope','$filter','$http',function($rootScope,$log,$modal,$scope,$filter,$http){
				$scope.notas=    [];

				$http.post('/api/notass')
			        .success(function(data) {
			            $scope.notas=data;
			            console.log(data)
			        })
			        .error(function(data) {
			            console.log('Error: ' + data);
			        });

				$scope.visible=true;
				$scope.ordenarImportancia= function(item){
							if(item.prioridad=="MuyImportante"){
								return 1;
							}	else if(item.prioridad=="Importante") {
								return 2;
							} else if(item.prioridad=="Normal"){
								return 3;
							}	else if(item.prioridad=="Poco"){
								return 4;
							}	else{
								return 5;
							}
						};

				$scope.ordenarImp = function(){
					$scope.notas=$filter('orderBy')($scope.notas, $scope.ordenarImportancia);
				}


				

				$log.log($scope.notas);

				$rootScope.$on('manu_item', function(event, data){
					if(data===1){
						$scope.visible=true;
						$log.log("Se selecciono Notas vale "+$scope.visible);
					}	else	{
						$scope.visible=false;
						$log.log("Se selecciono Otra cosa vale "+$scope.visible);
					}
				});

				this.quitar = function(id){
					$log.log("remover item: "+id);
					 $http.delete('/api/notas/' + id)
			            .success(function(data) {
			                $scope.notas = data;
			                console.log(data);
			            })
			            .error(function(data) {
			                console.log('Error:' + data);
			            });


				};
				this.agregarNoticia = function(){
					$log.log("Cargando el modal");
					$scope.prioridad="MuyImportante";
					this.modalInstance = $modal.open({
					    templateUrl: '/src/views/agregarNoticia.html',					    
    				});
				};

				this.ok = function (mail,titulo,d,p) {
					$log.log({titulo:titulo,descripcion:d,autor:mail,prioridad:p});
					//$scope.notas.push({titulo:titulo,descripcion:d,autor:mail});
					$http.post('/api/notas',{titulo:titulo,prioridad:p,descripcion:d,autor:mail}).success(function(data) {
			            $scope.notas.push(data);
			            console.log(data)
			        })
			        .error(function(data) {
			            console.log('Error: ' + data);
			        });
					this.modalInstance.dismiss();
				  };
				this.cancel = function(){
					this.modalInstance.dismiss();
				}

			}],
			controllerAs:'notasCtrl',
		};
	});

})();