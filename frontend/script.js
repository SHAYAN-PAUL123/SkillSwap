var timeout;

const scroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,
});

/* HERO ANIMATION */

function firstPageAnim() {

  var tl = gsap.timeline();

  tl.from("#nav", {
    y: -10,
    opacity: 0,
    duration: 1.5,
    ease: Expo.easeInOut,
  })

  .to(".boundingelem", {
    y: 0,
    ease: Expo.easeInOut,
    duration: 2,
    delay: -1,
    stagger: 0.2,
  })

  .from("#herofotter", {
    y: -10,
    opacity: 0,
    duration: 1.5,
    delay: -1,
    ease: Expo.easeInOut,
  })

  .from(".scroll", {
    y: -10,
    opacity: 0,
    duration: 1.5,
    delay: -1,
    ease: Expo.easeInOut,
  });
}

/* CURSOR */

function circleChaptaKaro() {

  var xscale = 1;
  var yscale = 1;

  var xprev = 0;
  var yprev = 0;

  window.addEventListener("mousemove", function (dets) {

    clearTimeout(timeout);

    xscale = gsap.utils.clamp(
      0.8,
      1.2,
      dets.clientX - xprev
    );

    yscale = gsap.utils.clamp(
      0.8,
      1.2,
      dets.clientY - yprev
    );

    xprev = dets.clientX;
    yprev = dets.clientY;

    circleMouseFollower(
      xscale,
      yscale,
      dets.clientX,
      dets.clientY
    );

    timeout = setTimeout(function () {

      document.querySelector("#minicircle").style.transform =
        `translate(${dets.clientX - 5}px, ${dets.clientY - 5}px)
         scale(1,1)`;

    }, 100);
  });
}

function circleMouseFollower(xscale, yscale, x, y) {

  document.querySelector("#minicircle").style.transform =
    `translate(${x - 5}px, ${y - 5}px)
     scale(${xscale}, ${yscale})`;
}

/* TIME */

function updateTime() {

  function setTime() {

    let now = new Date();

    let time = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    document.querySelector("#currenttime").textContent =
      time + " IST";
  }

  setTime();

  setInterval(setTime, 1000);
}

/* HOVER IMAGE */

document.querySelectorAll(".elem").forEach(function (elem) {

  var rotate = 0;
  var diffrot = 0;

  elem.addEventListener("mouseleave", function () {

    gsap.to(elem.querySelector("img"), {
      opacity: 0,
      ease: "power3.out",
      duration: 0.5,
    });
  });

  elem.addEventListener("mousemove", function (dets) {

    var diff =
      dets.clientY -
      elem.getBoundingClientRect().top;

    diffrot = dets.clientX - rotate;

    rotate = dets.clientX;

    let img = elem.querySelector("img");

    gsap.to(img, {

      opacity: 1,

      ease: "power3.out",

      top: diff - img.offsetHeight / 2,

      left: dets.clientX - img.offsetWidth / 2,

      rotate: gsap.utils.clamp(
        -20,
        20,
        diffrot * 0.5
      ),
    });
  });
});

const searchInput =
document.querySelector("#searchbox input");

if(searchInput){

    searchInput.addEventListener(
        "input",
        function(){

        let value =
        searchInput.value.toLowerCase();

        let skills =
        document.querySelectorAll(".elem");

        skills.forEach(function(skill){

            let text =
            skill.querySelector("h1")
            .textContent
            .toLowerCase();

            if(text.includes(value)){
                skill.style.display = "flex";
            }

            else{
                skill.style.display = "none";
            }
        });
    });
}


/* FORM VALIDATION AND API SUBMISSION */

const communityForm =
document.querySelector("#studentForm");

if (communityForm) {

  communityForm.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();

      let name =
      document.getElementById("name").value.trim();

      let phone =
      document.getElementById("phone").value.trim();

      let email =
      document.getElementById("email").value.trim();

      let teachSkill =
      document.getElementById("teaches").value.trim();

      let learnSkill =
      document.getElementById("learning").value.trim();

      /* EMPTY FIELD CHECK */

      if (
        name === "" ||
        phone === "" ||
        email === "" ||
        teachSkill === "" ||
        learnSkill === ""
      ) {

        alert(
          "Please fill all fields."
        );

        return;
      }

      /* PHONE VALIDATION */

      let phoneRegex =
      /^[0-9]{10}$/;

      if (!phoneRegex.test(phone)) {

        alert(
          "Please enter a valid 10-digit phone number."
        );

        return;
      }

      /* EMAIL VALIDATION */

      let emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {

        alert(
          "Please enter a valid email."
        );

        return;
      }

      /* SUBMIT TO BACKEND */

      try {
        const response = await fetch(`${API_URL}/getinfo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            phoneno: phone,
            email: email,
            skillsTeach: teachSkill,
            skillsLearn: learnSkill
          })
        });

        const result = await response.json();

        if (response.ok) {
          alert("Successfully Joined SkillSwap 🚀");
          communityForm.reset();
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        alert("Error submitting form: " + error.message);
        console.error(error);
      }
    }
  );
}

circleChaptaKaro();
if(document.querySelector("#heading")){
    firstPageAnim();
}
updateTime();

const API_URL = "https://skillswap-backend-s8x0.onrender.com";

/* LOAD STUDENTS FROM BACKEND */

function getRandomStudentImage() {
  const category = Math.random() < 0.5 ? "men" : "women";
  const imageNumber = Math.floor(Math.random() * 99) + 1;

  return `https://randomuser.me/api/portraits/${category}/${imageNumber}.jpg`;
}

async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/getinfo`);
    const data = await response.json();
    console.log("Students loaded:", data);

    if (data.posts && Array.isArray(data.posts)) {
      const studentGrid = document.querySelector("#student-grid");
      if (studentGrid) {
        // Clear existing hardcoded cards (optional)
        // studentGrid.innerHTML = '';

        data.posts.forEach(student => {
          const card = document.createElement("div");
          card.className = "student-card";
          card.innerHTML = `
            <img src="${getRandomStudentImage()}" alt="${student.name}">
            <h3>${student.name}</h3>
            <p><span>Teaches:</span> ${student.skillsTeach}</p>
            <p><span>Learning:</span> ${student.skillsLearn}</p>
            <a href="mailto:${student.email}">${student.email}</a>
            <p>Phone: ${student.phoneno}</p>
            <button>Connect</button>
          `;
          studentGrid.appendChild(card);
        });
      }
    }
  } catch (error) {
    console.error("Error loading students:", error);
  }
}

// Load students when page loads
if (document.querySelector("#student-grid")) {
  loadStudents();
}
