"use strict";
$(function () {
    getUserInfo();


    function getUserInfo() {
        let username = sessionStorage.getItem("username");
        $("#nav_name").text(username);
    }
  });