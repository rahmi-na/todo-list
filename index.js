(function ($) {
  $(document).ready(function () {
    var notificationTimeout;

    //menampilkan popup notifikasi yang diperbaharui
    var updateNotification = function (task, notificationText, newClass) {
      var notificationPopup = $(".notification-popup ");
      notificationPopup.find(".task").text(task);
      notificationPopup.find(".notification-text").text(notificationText);
      notificationPopup.removeClass("hide success");
      if (newClass) notificationPopup.addClass(newClass);
      if (notificationTimeout) clearTimeout(notificationTimeout);
      // memunculkan popup selama 3 detik
      notificationTimeout = setTimeout(function () {
        notificationPopup.addClass("hide");
      }, 3000);
    };

    // menambahkan task baru ke todo-list
    var addTask = function () {
      var newTask = $("#new-task").val();
      // jika task baru kosong maka tampilkan pesan error
      if (newTask == "") {
        $("#new-task").addClass("error");
        $(".new-task-wrapper .error-message").removeClass("hidden");
      } else {
        var todoListScrollHeight = $(".todo-list-body").prop("scrollHeight");
        // membuat template task baru
        var newTemplate = $(taskTemplate).clone();
        newTemplate.find(".task-label").text(newTask);
        newTemplate.addClass("new");
        newTemplate.removeClass("completed");
        $("#todo-list").append(newTemplate);
        $("#new-task").val("");
        $("#mark-all-finished").removeClass("move-up");
        $("#mark-all-incomplete").addClass("move-down");

        updateNotification(newTask, "added to list");

        // Smoothly scroll the todo list to the end
        $(".todo-list-body").animate({
          scrollTop: todoListScrollHeight
        }, 1000);
      }
    };

    // Closes the panel for entering new tasks & shows the button for opening the panel
    var closeNewTaskPanel = function () {
      $(".add-task-btn").toggleClass("hide");
      $(".new-task-wrapper").toggleClass("visible");
      if ($("#new-task").hasClass("error")) {
        $("#new-task").removeClass("error");
        $(".new-task-wrapper .error-message").addClass("hidden");
      }
    };


    var taskTemplate = $($("#task-template").html());

    // Shows panel for entering new tasks
    $(".add-task-btn").click(function () {
      var newTaskWrapperOffset = $(".new-task-wrapper").offset().top;
      $(this).toggleClass("hide");
      $(".new-task-wrapper").toggleClass("visible");
      $("#new-task").focus();
      $("body").animate({
        scrollTop: newTaskWrapperOffset
      }, 1000);
    });

    // Deletes task 
    $("#todo-list").on("click", ".task-action-btn .delete-btn", function () {
      var task = $(this).closest(".task");
      var taskText = task.find(".task-label").text();
      task.remove();
      updateNotification(taskText, " has been deleted.");
    });

    // Marks a task as complete
    $("#todo-list").on("click", ".task-action-btn .complete-btn", function () {
      var task = $(this).closest(".task");
      var taskText = task.find(".task-label").text();
      var newTitle = task.hasClass("completed") ?
        "Mark Complete" :
        "Mark Incomplete";
      $(this).attr("title", newTitle);
      task.hasClass("completed") ?
        updateNotification(taskText, "marked as Incomplete.") :
        updateNotification(taskText, " marked as complete.", "success");
      task.toggleClass("completed");
    });

    $("#new-task").keydown(function (event) {
      var keyCode = event.keyCode;
      var enterKeyCode = 13;
      var escapeKeyCode = 27;
      // If error message
      if ($("#new-task").hasClass("error")) {
        $("#new-task").removeClass("error");
        $(".new-task-wrapper .error-message").addClass("hidden");
      }
      // If key code is that of Enter Key then call addTask Function
      if (keyCode == enterKeyCode) {
        event.preventDefault();
        addTask();
      }
      // If key code is that of Esc Key then call closeNewTaskPanel Function
      else if (keyCode == escapeKeyCode) closeNewTaskPanel();
    });

    // Add new task on click of add task button
    $("#add-task").click(addTask);

    // Close new task panel on click of close panel button
    $("#close-task-panel").click(closeNewTaskPanel);

    // Mark all tasks as complete on click of mark all finished button
    $("#mark-all-finished").click(function () {
      $("#todo-list .task").addClass("completed");
      $("#mark-all-incomplete").removeClass("move-down");
      $(this).addClass("move-up");
      updateNotification("All tasks", "marked as complete.", "success");
    });

    // menandai semua task menjadi 'belum selesai'
    $("#mark-all-incomplete").click(function () {
      $("#todo-list .task").removeClass("completed");
      $(this).addClass("move-down");
      $("#mark-all-finished").removeClass("move-up");
      updateNotification("All tasks", "marked as Incomplete.");
    });

    // untuk menghapus semua data pada todo-list
    $(".clear-all").click(function () {
      $(".task").empty();
    });

  });
})(jQuery);