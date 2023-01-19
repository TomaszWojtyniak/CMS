"use strict";
$(function () {

  getUserInfo();

    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
      event.preventDefault();
      $(this).ekkoLightbox({
        alwaysShowClose: true
      });
    });



    $('.filter-container').filterizr({gutterPixels: 3});
    $('.btn[data-filter]').on('click', function() {
      $('.btn[data-filter]').removeClass('active');
      $(this).addClass('active');
    });

    function getUserInfo() {
      let username = sessionStorage.getItem("username");
      let accessToken = sessionStorage.getItem("access_token");
      $.ajax({
        type: "GET",
        url: "http://localhost:3000/username/" + username,
        dataType: "json",
        contentType: "application/json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        success: function(data){
          if (data[0].is_admin == true) {
            $("#tables_nav_item").hide();
            $("#charts_nav_item").hide();
          }
          $("#nav_name").text(username);
          loadMovieLists();
         },
         error: function(xhr, textStatus, error){
           alert("error")
         }
      });
    }

    function loadMovieLists() {
      $.getJSON("../../sample-data/movie_list.json", function(data) {
        $.each(data, function(key, value) {
          $.each(value, function(key, list_value) {
            $("#movie-lists-container").append(`
              <div class="card card-primary">
                <div class="card-header">
                  <h4 class="card-title">` + list_value.list_name + `</h4>
                </div>
                <div class="card-body"> 
              </div>
                  <div>
                    <div class="filter-container p-0 row" id="movie_container-` + list_value.list_id + `">
                    </div>
                  </div>
                </div>
              </div>
            `)

            $.each(list_value.movies, function(key, value) {
              $("#movie_container-" + list_value.list_id + "").append(`
                <div class="filtr-item col-sm-2" data-sort="` + value.movie_name + `">
                  <a href="` + value.movie_url + `" data-toggle="lightbox" data-title="` + value.movie_name + `">
                    <img src="` + value.movie_url + `" class="img-fluid mb-2" alt="` + value.movie_name + `"/>
                  </a>
                </div>
              `)
            })
          })
        })
      })

    };
  })