let currentsong =new Audio()
let songs;
let currFolder;


async function getsong(folder)
{
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/projectt/VibeBeat/${folder}/info.json`)  
     let response = await a.text();
        // console.log(response)
        let div =document.createElement("div")
        div.innerHTML = response;
        let as=div.getElementsByTagName("a")
        // console.log(as)
        songs=[];
        for(let i=0;i<as.length;i++)
        {
            const elem=as[i];
            if(elem.href.endsWith(".mp3"))
            {
                songs.push(elem.href.split(`/${folder}/`)[1])
            }
        }
        
    let songUl=document.querySelector('.songslist').getElementsByTagName("ul")[0];
    songUl.innerHTML="";
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+ `<li>  <i class="fa-solid fa-music"></i>
                    <div class="info">
                        <div>${song.replaceAll("%20"," ")}</div>
                        <div> </div>
                    </div>
                    <div class="playnow">   <span>play now</span>
                        <i class="fa-solid fa-play"></i>
                    </div>
                 
                   </li>`;
        
    }
    // attach an event listener to each song
    Array.from(document.querySelector('.songslist').getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",function(){
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    return songs
}
const playMusic = (track, pause = false) => {
    currentsong.src = `http://127.0.0.1:5500/projectt/VibeBeat/${currFolder}/` + track;

       if(!pause)
       {
         currentsong.play();
         play.classList.remove("fa-play"); 
         play.classList.add("fa-pause");
       }
            
     document.querySelector(".songInfo").innerHTML= decodeURI(track)
     document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

//  async function displayAlbums()
//  {
//     let a = await fetch(`http://127.0.0.1:5500/projectt/sptify/songs/`)  
//     let response = await a.text();
//         // console.log(response)
//        let div =document.createElement("div")
//        div.innerHTML = response;
//     //    console.log(div)
//     let anchors=div.getElementsByTagName("a");
//     let cardcantainer=document.querySelector(".cardcontainer")
//     let array=Array.from(anchors)
//     for(let i=0;i<array.length;i++)
//     {
//         const e=array[i];
//         if(e.href.includes("/songs/"))
//         {
//             console.log(e.href)
//            let folder= console.log(e.href.split("/").slice(-1)[0])
//            //get meta data
//            try {
//             let a = await fetch(`http://127.0.0.1:5500/projectt/sptify/songs/${folder}/info.json`);
            
//             if (!a.ok) {
//                 throw new Error(`HTTP Error! Status: ${a.status}`);
//             }
        
//             let response = await a.json();
//             console.log("Album metadata:", response);
        
//         } catch (error) {
//             console.error(`Error fetching metadata for ${folder}:`, error);
//         }
//            cardcantainer.innerHTML=cardcantainer.innerHTML + `<div  data-folder="jatin" class="card  ">
//                 <div class="play">
//                     <i class="fa-solid fa-play"></i>
//                 </div>
//                 <img src="/songs/karan_aujla/jatin.jpg " alt="hits">
//                 <h2>${response.title}</h2>
//                 <p> ${response.discription}</p>

//             </div>`
//         }
//     } 
//     Array.from(document.getElementsByClassName("card")).forEach(e=>
//         {
//            console.log(e);
//             e.addEventListener("click",async item=>
//             {          songs=await getsong(`songs/${item.currentTarget.dataset.folder}`)
//           })
           
//        })
//  }
  
async function main2()
{
    //get the list of songs
   await getsong("songs/jatin")
    console.log(songs)
    playMusic(songs[0],true)
    
    //display all albums on the page
    // displayAlbums();

     // attach an event listener to each play,prwv,next
     play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.classList.remove("fa-play");  // Remove play icon
            play.classList.add("fa-pause");   // Add pause icon
        } else {
            currentsong.pause();
            play.classList.remove("fa-pause"); // Remove pause icon
            play.classList.add("fa-play");    // Add play icon
        }
    });
    // listen for time update
  // Listen for time update
currentsong.addEventListener("timeupdate", () => { 
    console.log(currentsong.currentTime, currentsong.duration);
    
    // Check if duration is valid before updating the UI
    let currentTimeFormatted = secondsToMinutesSeconds(currentsong.currentTime);
    let durationFormatted = isNaN(currentsong.duration) ? "00:00" : secondsToMinutesSeconds(currentsong.duration);
    
    document.querySelector(".songtime").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
});

// Function to format seconds into MM:SS
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00"; // Handle NaN or negative values
    
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    // Ensure two-digit formatting
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
 
}
currentsong.addEventListener("timeupdate", () => {
    let progressCircle = document.querySelector(".circle");
    
    if (progressCircle && !isNaN(currentsong.duration)) {
        let progress = (currentsong.currentTime / currentsong.duration) * 100;
        progressCircle.style.left = `${progress}%`;
    }
});

document.querySelector(".seekbar").addEventListener("click",(e)=>
{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent +"%";
    currentsong.currentTime=((currentsong.duration)*percent)/100;
})

// add n event on hamburger
document.querySelector(".hamburger").addEventListener("click",()=>
{
    document.querySelector(".left").style.left="0"
})
document.querySelector(".close").addEventListener("click",()=>
{
    document.querySelector(".left").style.left="-120%";
})

// add event to prev and next
 back.addEventListener("click", () => {
    currentsong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentsong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})

//load library
   Array.from(document.getElementsByClassName("card")).forEach(e=>
    {
        console.log(e);
       e.addEventListener("click",async item=>
        {          songs=await getsong(`songs/${item.currentTarget.dataset.folder}`)
      })
     
   })


}

main2();
