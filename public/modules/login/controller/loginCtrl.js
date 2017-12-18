angular.module('LoginCtrl', [])
.controller('LoginController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    document.getElementById("navbar").style.visibility = "hidden";
    document.getElementById("body_content").setAttribute('class', 'login');

    $(document).ready(function() {
        $("#login_form").validate({
            rules: {
                username: {
                    required: true,
                    minlength: 5
                },
                passwordIcon: {
                    required: true,
                    minlength: 5
                }
            },
             //For custom messages
            messages: {
                username:{
                    required: "Enter a username",
                    minlength: "Enter at least 5 characters"
                },
                passwordIcon:{
                    required: "Enter a username",
                    minlength: "Enter at least 5 characters"
                },
            },
            errorElement : 'div',
            errorPlacement: function(error, element) {
                var placement = $(element).data('error');
                if (placement) {
                    $(placement).append(error)
                } else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function(form) {
                form.submit();
              }
        });
            
    });

    var vm = this;

    function login() {
        console.log("login")
        document.getElementById("body_content").setAttribute('class', '');
    }

}])