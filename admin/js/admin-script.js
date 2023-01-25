"use strict";
$(function () {

  var lists_id = [];
  let accessToken = sessionStorage.getItem("access_token");
  getUserInfo();

    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
      event.preventDefault();
      $(this).ekkoLightbox({
        alwaysShowClose: true
      });
    });



    $('.btn[data-filter]').on('click', function() {
      $('.btn[data-filter]').removeClass('active');
      $(this).addClass('active');
    });

    function getUserInfo() {
      let username = sessionStorage.getItem("username");
      $.ajax({
        type: "GET",
        url: "http://localhost:3000/username/" + username,
        dataType: "json",
        contentType: "application/json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        success: function(data){
          $("#charts_nav_item").hide();
          if (data[0].is_admin == false) {
            $("#tables_nav_item").hide();
          }
          $("#nav_name").text(username);
          $.each(data[0].lists, function(key, value) {
            lists_id.push(value.id)
            $("#movie-lists-container").append(`
            <div class="card card-primary">
              <div class="card-header">
                <h4 class="card-title">` + value.name + `</h4>
              </div>
              <div class="card-body"> 
            </div>
                <div>
                  <div class="filter-container p-0 row" id="movie_container-` + value.id + `">
                  </div>
                </div>
              </div>
            </div>
          `)
          })
          loadMovieLists();
         },
         error: function(xhr, textStatus, error){
           alert("error")
         }
      });
    }

    function loadMovieLists() {
      $.each(lists_id, function(index, list_id){
        var movies_id_in_list = []
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/listedmovies/" + list_id,
            contentType: "application/json",
            dataType: 'json',
            headers: {
              "Authorization": "Bearer " + accessToken
            },
            success: function(data){
              $.each(data, function(key, movie_value) {
                movies_id_in_list.push(movie_value.movie_id)
              });
              loadMovies(movies_id_in_list, list_id)
                
            },
            error: function(xhr, textStatus, error){
                alert("error")
            }
        })
      });
    }

    function loadMovies(movies_id_in_list, list_id) {
      $.each(movies_id_in_list, function(key, value) {
        $.ajax({
          type: "GET",
          url: "http://localhost:3000/movie/" + value,
          contentType: "application/json",
          dataType: 'json',
          headers: {
            "Authorization": "Bearer " + accessToken
          },
          success: function(data){
            $("#movie_container-" + list_id + "").append(`
            <div class="filtr-item col-sm-2" data-sort="` + data.name + `">
              <a href="` + "../../sample-data/gump.jpg" + `" data-toggle="lightbox" data-title="` + data.name + `">
                <img src="` + "../../sample-data/gump.jpg" + `" class="img-fluid mb-2" alt="` + data.name + `"/>
              </a>
            </div>
          `)
          },
          error: function(xhr, textStatus, error){
              alert("error")
          }
      })
      })
    };
  })