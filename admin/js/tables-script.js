"use strict";
$(function () {
    getUserInfo();
    getUserID();
    var userID = 0;
    function getUserInfo() {
        let username = sessionStorage.getItem("username");
        $("#nav_name").text(username);
        $("#charts_nav_item").hide();
        loadMovies();
    }

    $('#movies_body').on('click', '.bg-primary' ,function() {
        var id = $(this).attr('id');
        id = id.split('-').pop();
        let accessToken = sessionStorage.getItem("access_token")
        $.ajax({
            type: "DELETE",
            url: "http://localhost:3000/movie/" + id,
            contentType: "application/json",
            dataType: 'json',
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function(data) {
                location.reload();

            },
            error: function(xhr, textStatus, error){
                alert("error")
            }

        })
        $("#tr-" + id).remove();
    });

    $("#add_movies_table").on('click', '#add_movie_button', function() {
        var name = $("#movie_name").val();
        var year = $("#year").val();
        var category = $("#category").val();
        let accessToken = sessionStorage.getItem("access_token")
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/movie",
            contentType: "application/json",
            dataType: 'json',
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({
                "name": name,
                "year": year,
                "category": category
            }),
            success: function(data) {
                location.reload();

            },
            error: function(xhr, textStatus, error){
                alert("error")
            }

        })
    })

    $("#add_list_table").on('click', '#add_list_button', function() {
        var name = $("#list_name").val();
        let accessToken = sessionStorage.getItem("access_token")
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/list",
            contentType: "application/json",
            dataType: 'json',
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({
                "user_id": userID,
                "name": name,
                "description": "description"
            }),
            success: function(data) {
                addMoviesToList(data.id)
            },
            error: function(xhr, textStatus, error){
                alert("error")
            }

        })
    })

    $('movie_ids_list').mousedown(function(e) {
        e.preventDefault();
        $(this).prop('selected', !$(this).prop('selected'));
        return false;
    });

    function addMoviesToList(listID) {
        var movie_id = $("#movie_ids_list").val();
        let accessToken = sessionStorage.getItem("access_token")
        $.each(movie_id, function(key, value) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/listing",
                contentType: "application/json",
                dataType: 'json',
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                data: JSON.stringify({
                    "place_on_the_list": 1,
                    "list_id": listID,
                    "movie_id": value
                }),
                success: function(data) {
                    location.reload();
    
                },
                error: function(xhr, textStatus, error){
                    alert("error listing")
                }
    
            })
        })

    }

    function loadMovies() {
        let accessToken = sessionStorage.getItem("access_token")
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/movie",
            contentType: "application/json",
            dataType: 'json',
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function(data){
                $.each(data, function(key, value) {
                    $("#movies_body").append(`
                    <tr id='tr-` + value.id + `' >
                        <td>`+ value.id + `</td>
                        <td>` + value.name + `</td>
                        <td>` + value.year + `</td>
                        <td>` + value.category + `</td>
                        <td> <button id='but-` + value.id + `' class='bg-primary'>delete</button> </td>
                    </tr>
                    `)

                    $("#movie_ids_list").append(`
                    <option value="` + value.id + `">` + value.id + `</option>
                    `)
                });
            },
            error: function(xhr, textStatus, error){
                alert("error")
            }

        })
    }

    function getUserID() {
        let accessToken = sessionStorage.getItem("access_token")
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
            $.each(data, function(key, value) {
                userID = value.id
            });
           },
           error: function(xhr, textStatus, error){
             alert("error")
           }
        });
      }
});
