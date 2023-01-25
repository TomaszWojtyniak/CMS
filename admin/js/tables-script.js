"use strict";
$(function () {
    getUserInfo();
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
                });
            },
            error: function(xhr, textStatus, error){
                alert("error")
            }

        })
    }
});
