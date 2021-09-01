let workoutlog = [];
let myChart;

fetch('/api/transaction')
  .then((response) => response.json())
  .then((data) => {
    // save db data on global variable
    workoutlog = data;
    populateTotal();
    populateTable();
    populateChart();
  });
  
// create record
const workoutlog = {
  type: cardio.El.value,
  name: workout.El.value,
  value: repsEl.value,
  date: new Date().toISOString(),
};

// add to beginning of current array of data
workoutlog.unshift(workouts);

// re-run logic to populate ui with new record
populateChart();
populateTable();
populateTotal();

// also send to server
fetch('/api/transaction', {
  method: 'POST',
  body: JSON.stringify(workouts),
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data.errors) {
      errorEl.textContent = 'Missing Information';
    } else {
      // clear form
      nameEl.value = '';
      amountEl.value = '';
    }
  })
  .catch((err) => {
    // fetch failed, so save in indexed db
    console.log('save record');
    saveRecord(transaction);

    // clear form
    nameEl.value = '';
    amountEl.value = '';
  });
}

document.querySelector('#add-btn').addEventListener('click', function (event) {
event.preventDefault();
sendTransaction(true);
});

document.querySelector('#sub-btn').addEventListener('click', function (event) {
event.preventDefault();
sendTransaction(false);
});



init();

async function init() {
  if (location.search.split("=")[1] === undefined) {
    const workout = await API.getLastWorkout();
    if (workout) {
      location.search = "?id=" + workout._id;
    } else {
      document.querySelector("#continue-btn").classList.add("d-none")
    }
  }
}

