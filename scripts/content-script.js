
const path = window.location.pathname.toLowerCase();

if (path == "/applicanthome"){
  const portal_dashboard = document.querySelectorAll("#dashboard-table > tbody > tr > td");
  const visa_category_info_tile_text = portal_dashboard[1].innerText;
  chrome.storage.local.set({"visa_category_data": visa_category_info_tile_text }).then(() => {
    console.log("Visa class is set");
  });
}

if (path == "/scheduleappointment"){
  function sendAppointmentDetails(){
    var element = document.getElementById("thePage:SiteTemplate:theForm");
    if (element) {
      html2canvas(element, {Usecors: true})
      .then(function(canvas) {
        canvas.toBlob(function(blob) {
          chrome.storage.local.get(["visa_category_data"]).then((data) => {
            const formData = new FormData();
            const first_available_date = getLatestAvailable();
            if (!first_available_date){
              return;
            }
            formData.append("country", document.getElementById("country-specific").innerText);
            formData.append("latestavailable.date", first_available_date.date);
            formData.append("latestavailable.time", first_available_date.time);
            formData.append("latestavailable.slots", first_available_date.slots);
            formData.append("appointmentcalendar", blob, "appointment-calendar.png");
            formData.append("visacategoryinfo", data.visa_category_data);
    
            fetch("https://b1b2visaslotsnepal.utsavphunyal.com/api/VisaSlot", {
              method: 'POST',
              body: formData
            })
              .then().catch((error) => { console.log(error) });;
        }); 
          });
      })
        .catch(function(error) {
          console.log("Error capturing screenshot:", error);
        });
      }
  }
  
  function getLatestAvailable(){
      var trElement = document.getElementById("myCalendarTable").rows[1];
      if (!trElement){
        return;  
      }
      const timeValue = trElement.querySelector('td:nth-child(2)').textContent.trim();
      const dateValue = trElement.querySelector('td:nth-child(3)').textContent.trim();
      const numberValue = trElement.querySelector('td:nth-child(4)').textContent.trim();
      return {"time": timeValue, "date":dateValue, "slots":numberValue };
  }

  sendAppointmentDetails();
}

