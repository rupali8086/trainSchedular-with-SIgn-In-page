
$(document).ready(function(){
     $('.container ').hide();

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCHP4hygJ8Oudpxn_ymeNyAZZbiv9Wm368",
    authDomain: "project-1-47afa.firebaseapp.com",
    databaseURL: "https://project-1-47afa.firebaseio.com",
    projectId: "project-1-47afa",
    storageBucket: "project-1-47afa.appspot.com",
    messagingSenderId: "1052854905714"
};
    firebase.initializeApp(config);
    // ===================================sign in using google============================================================================
    
      // sign in using google
    $(document).on('click', '.signIn', function() {
    
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      $('.container ').show();
       
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    $(this).removeClass('signIn')
      .addClass('signOut')
      .html('Sign Out ');
  });

    $(document).on('click', '.signOut', function () {
    firebase.auth().signOut().then(function() {
      $('.container ').hide();
    }, function(error) {
      // An error happened.
    });
    $(this).removeClass('signOut')
      .addClass('signIn')
      .html('Google ');
  });
// ================================================================================================================================
// ===================================sign in github============================================================================
    
      
    $(document).on('click', '.signInGithub', function() {
    console.log("hi github");
   var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log(user);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
    $(this).removeClass('signIn')
      .addClass('signOut')
      .html('Sign Out ');
  });

    $(document).on('click', '.signOut', function () {
    firebase.auth().signOut().then(function() {
      $('.container ').hide();
    }, function(error) {
      // An error happened.
    });
    $(this).removeClass('signOut')
      .addClass('signIn')
      .html('Github ');
  });
// ================================================================================================================================
var database = firebase.database();

// 2. Button for adding Train Schedule
$("#addTrainBtn").on("click", function(event){
     
     event.preventDefault();

	// Grabs user input
	var trainName = $("#trainNameInput").val().trim();
	var dest = $("#destinationInput").val().trim();
	var firstTrain = moment($("#firstTrainInput").val().trim(),"HH:mm" ).format("X");
	var freq = $("#frequencyInput").val().trim();
	

	// Creates local "temporary" object for holding Train schedule 
	var newTrain = {
		name:  trainName,
		dest: dest,
		start: firstTrain,
		frequency: freq
	}

	// Uploads data to the database
	database.ref().push(newTrain);
	// Logs everything to console
	console.log(newTrain.name);
	console.log(newTrain.dest);
	console.log(newTrain.start);
	console.log(newTrain.frequency);

	// Alert
	alert("Train Schedule successfully added");

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	return false;

});



// 3. Create Firebase event for addingtran to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().dest;
	var trainStart = childSnapshot.val().start;
	var trainFreq = childSnapshot.val().frequency;
	var key = childSnapshot.key;
	var remove = "<button class='glyphicon glyphicon-trash' id=" + key + "></button>"
	var updateMe = "<button class='glyphicon glyphicon-edit' id=" + key + "></button>"

	// Train Info
	console.log(trainName);
	console.log(trainDest);
	console.log(trainStart);
	console.log(trainFreq);

    // Display--- current time
   var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));
    setInterval(function(){
    $('#current-status').html("Current Time: " + moment().format('dddd, MMMM Do YYYY, HH:mm:ss a'))
   }, 1000);


	// First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(trainStart, "hh:mm").subtract(1, "years");
  //console.log("FTC: "+firstTimeConverted);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  
  // Time apart (remainder)
  var timeRemainder = diffTime % trainFreq ;

  // Minute Until Train
  var minutes = trainFreq - timeRemainder;

  // Next Train
  var nextTrain = moment().add(minutes, "minutes");

  // Arrival time
  var nextTrainArrival = moment(nextTrain).format("hh:mm a");
	

  // Add each train's data into the table
  $("#trainTable > tbody").prepend("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextTrainArrival  + "</td><td>" + minutes + "</td><td>"+ remove+ "</td><td>"+ updateMe + "</td></tr>");
  
  }, function(err) {
        console.log(err);
    });

    

    //on click command to delete key when user clicks the trash gliphicon
        $(document).on("click", ".glyphicon-trash", deleteTrain);

         function deleteTrain() {
        	alert("are you sure , you want delete this data ??");
          // if()
        	var deleteKey = $(this).attr("id");
            database.ref().child(deleteKey).remove();
            location.reload();
        }
  
 });


		/*(document).on("click", ".glyphicon-edit", updateTrain);
		    function updateTrain(childSnapshot,prevChildKey) {
		        var updateKey = $(this).attr("id");
		        // updates[] =newTrain;
            // var changedPost = childSnapshot.val();
            var trainName = childSnapshot.val().name;
            var trainDest = childSnapshot.val().dest;
            var trainStart = childSnapshot.val().start;
            var trainFreq = childSnapshot.val().frequency;
            var key = childSnapshot.key;

            // Creates local "temporary" object for holding Train schedule 
            var newTrain = {
              name:  trainName,
              dest: dest,
              start: firstTrain,
              frequency: freq
            }
           
            // Uploads data to the database
            // database.ref().push(newTrain);
            // Logs everything to console
            // console.log(newTrain.name);
            // console.log(newTrain.dest);
            // console.log(newTrain.start);
            // console.log(newTrain.frequency);
           

		        database.ref(updateKey).once('value').then(function(childSnapshot) {
              $('#trainNameInput').val(childSnapshot.val().trainName);
        $('#destinationInput').val(childSnapshot.val().trainDestination);
        $('#firstTrainInput').val(moment.unix(childSnapshot.val().trainTime).format('HH:mm'));
        $('#frequencyInput').val(childSnapshot.val().trainFreq);
        // $('#trainKey').val(childSnapshot.key);
		   }
            */
	 	  



