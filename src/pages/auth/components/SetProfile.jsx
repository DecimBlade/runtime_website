import React, { useRef, useState, useEffect } from "react"
import { Alert, Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { auth, db, storage } from "../../../firebase"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"
import "firebase/compat/firestore"
import {Switch} from "@headlessui/react"
import { DarkModeSwitch } from "react-toggle-dark-mode";
import DarkMode from "../../../features/profile/components/darkMode";
// import ProfileUploadPopup from "../../../features/profile/components/ProfileUploadPopup"
import Avatar from '@mui/material/Avatar';
import {useTranslation} from 'react-i18next';
import {v4 as uuid} from "uuid";


const languages = [
    {value: '', text: "Options"},
    {value: 'en', text: "English"},
    {value: 'zh', text: "Chinese"},
    {value: 'de', text: "German"},
    {value: 'ja', text: "Japanese"},
    {value: 'ko', text: "Korean"},
    {value: 'es', text: "Spanish"},
    {value: 'tl', text: "Tagalog"}
]
// profile creation page from the sign in page
// rerouting from the sign in page to the profile creation page
// the user will be able to add their first name, last name, username, and their favorite genre before heading to their profile page

export default function SetProfile() {

    const {currentUser, updateEmail} = useAuth()
    const navigate = useNavigate()

    const user = auth.currentUser;
    const userRef = db.users.doc(user.uid)
    //added

    const emailRef = useRef()

    const firstNameRef = useRef()
    const [firstName, setFirstName] = useState()

    const lastNameRef = useRef()
    const [lastName, setLastName] = useState()
    
    const usernameRef = useRef()
    const [username, setUsername] = useState()

    const genreRef = useRef()
    const [genre, setGenre] = useState()

    const [error, setError] = useState("")
    const [usernameError, setUsernameError] = useState("")

    const [enabled, setEnabled] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    // for light/dark mode to save state
    

    // useEffect(() =>{
    //     if(darkMode === true) {
    //         localStorage.setItem("darkMode", JSON.stringify(true))
    //         document.body.style.background = 'dark'
    //         console.log('dark mode enabled') 
    //     }
    //     else{
    //         localStorage.setItem("darkMode", JSON.stringify(false))
    //         document.body.style.background = 'light'
    //         console.log('dark mode disabled')
    //     }
    // }, [darkMode]) 

    function isAlphanumeric(str) {
        return /^[a-zA-Z0-9]+$/.test(str);
    }      
    
    userRef.get().then((doc) => {
        if(doc.exists) {
            console.log("Document data:", doc.data());
            setFirstName(doc.data().firstName)
            setLastName(doc.data().lastName)
            setUsername(doc.data().username)
            setGenre(doc.data().genre)
            // colorTheme(doc.data().colorTheme)
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    
    const [colorTheme, setTheme] = DarkMode();

    
    const [darkMode, setDarkMode] = useState(
        colorTheme === "light" ? true : false
    );

    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkMode(checked);
    };
    
    

    // Submission handler
    async function handleSubmit(e) {
    e.preventDefault()

    const promises = []
    setError("")

    if(emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value))
    }
    
    const snapshot = await db.users.where("username", "==", usernameRef.current.value).get();
    if(isAlphanumeric(usernameRef.current.value)) {
        if(snapshot.empty || usernameRef.current.value === username) {
            promises.push(userRef.update({
                email: emailRef.current.value,
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                username: usernameRef.current.value,
                genre: genreRef.current.value,
                uid: user.uid,

            }))
            Promise.all(promises).then(() => {
                navigate('/dashboard')
            }).catch(() => {
                setError('Failed to update account')
            }).finally(() =>  {
            
            })
        } else {
            setUsernameError("Username taken")
        }
    } else {
    setUsernameError("Username must consist of letters and numbers only (no spaces).")
    }
    }

    const[image, setImage] = useState(null);
    const [url, setUrl] = useState(null);

    const handleImageChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };
    console.log(image);
    
    const handleProfileSubmit = (e) => {
        const imageRef = ref(storage, "image");
        uploadBytes(imageRef, image).then(() =>{
            getDownloadURL(imageRef).then((url) => {
                setUrl(url);
            }).catch(error => {
                console.log(error.message, "error getting image url");
            });
            setImage(null);
        }).catch(error => {
            console.log(error.message);
        });
    };
    

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async (uid) =>{
        const storageRef = ref(storage, `users/${uid}/profilePicture`);
        const snapshot = await uploadBytes(storageRef, file);
        console.log("File uploaded");
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        uploadFile(currentUser.uid);
    };

    const[profilePictureUrl, setProfilePictureUrl] = useState('');

    useEffect(() => {
        const storageRef = ref(storage, `users/${currentUser.uid}/profilePicture`);
        getDownloadURL(storageRef).then((url) => {
            setProfilePictureUrl(url);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [currentUser.uid]);

    // const [img, setImg] = useState(null);

    // const handleSend = async () => {
    //     if(img){

    //     }else{
    //         await updateDoc(doc(db, "users", currentUser.uid), {
    //             profilePicture: img({
    //                 id: uuid,
    //                 userId: currentUser.uid,
    //                 date: Timestamp.now()
    //             })
    //         });
    //     }
    // };

    const ProfileUpload = () => (
        <div class="flex justify-center mt-8 space-x-10">
            <Avatar
                alt="Profile Picture"
                src={url}
                sx={{ width: 200, height: 200 }}
                />
            <div class="max-w-2xl rounded-lg shadow-xl bg-white dark:bg-slate-600 dark:text-white">
                <div class="m-4">
                    <label class="inline-block mb-2 text-gray-500 dark:text-white">File Upload</label>
                    <div class="flex items-center justify-center w-full">
                        <label
                            class="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed dark:border-white hover:bg-gray-100 hover:border-gray-300 dark:bg-slate-600 dark:text-white">
                            <div class="flex flex-col items-center justify-center pt-7">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600 dark:text-white">
                                    Attach a file
                                </p>
                            </div>
                            <input type="file" onChange={handleFileChange} class="opacity-0"/>
                            <img src={profilePictureUrl}/>
                        </label>
                    </div>
                </div>
                <div class="flex justify-center p-2">
                    <button onClick={handleProfileSubmit} class="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl">Upload</button>
                </div>
            </div>
            {/* <form>
                <input style={{display:"none"}} type="file" id="file" onChange={e=>setImg(e.target.files[0])}/>
                <label htmlFor="file">
                    Profile Pic Upload
                    <img src={img} alt="" />
                </label>
                <button onClick={handleSend}> Send </button>
            </form> */}

        </div> 
    )

    const {t} = useTranslation();
    const [lang, setLang] = useState('');

    const handleChange = e => { 
        setLang(e.target.value);
        let loc = "http://www.runtime.live/";
        window.location.replace(loc + "?lng=" + e.target.value);
    }

    return(
    <div className="flex justify-center items-center relative min-h-screen bg-no-repeat w-full bg-cover bg-blue-200 dark:bg-slate-800 gap-10">
        <form onSubmit={handleSubmit} className="relative-right-[15%] bg-white dark:bg-slate-700 dark:text-white shadow-md rounded px-8 pt-6 mb-4">    
            {/* <div className="flex justify-center">
                <img src="[url('/public/images/Logo.jpg')]" alt="Logo" className="w-14 h-14"></img>
            </div> */}
                <h1>Additional Information</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="mb-4">
                <label
                class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
                for="email address">
                    
                Email Address
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="first name"
                    type="text"
                    placeholder="Email Address"
                    ref={emailRef} required
                    defaultValue={currentUser.email}>
                </input>
            </div>
            <div className="mb-4">
                <label
                class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
                for="first name">
                First Name
                {/* {db.users.doc(user.uid).get({source: 'cache'})} */}
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="first name"
                    type="text"
                    placeholder="First name"
                    ref={firstNameRef}
                    defaultValue={firstName}
                    required>
                </input>
            </div>
            <div class="mb-4">
                <label
                class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
                for="password">
                Last Name
                </label>
                <input
                    class="shadow appearance-none border border-black-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="last name"
                    type="text"
                    placeholder="Last name"
                    ref={lastNameRef}
                    defaultValue={lastName}
                    required>
                </input>
            </div>
            <div class="mb-4">
                <label
                class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
                for="username">
                Username
                </label>
                <input
                    class="shadow appearance-none border border-black-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Username"
                    ref={usernameRef}
                    defaultValue={username}
                    required>
                </input>
                {usernameError && <Alert variant="danger">{usernameError}</Alert>}
            </div>
            {/* Dropdown menu for form to allow users to pick their favorite genre and get recommendations for them*/}
            <div className="relative w-full lg:max-w-sm">
            <label
                class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
                for="movie genre">
                Favorite Movie Genre
                </label>
            <select className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none focus:shadow-outline appearance-none focus:border-indigo-600"
            ref={genreRef}>
                {genre !=="" ? <option selected disabled>{genre} </option>
                :
                <option selected>None</option>}
                <option>Action</option>
                <option>Adventure</option>
                <option>Animation</option>
                <option>Comedy</option>
                <option>Crime</option>
                <option>Documentary</option>
                <option>Drama</option>
                <option>Family</option>
                <option>Fantasy</option>
                <option>History</option>
                <option>Horror</option>
                <option>Music</option>
                <option>Mystery</option>
                <option>Romance</option>
                <option>Sci-Fi</option>
                <option>TV Movie</option>
                <option>Thriller</option>
                <option>War</option>
                <option>Western</option>
            </select>
        </div>
            <button type="submit" class="btn btn-primary my-6 w-full duration-200 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" >Set Profile</button>
            {/* <div className="mb-4 text-center mt-2">
                <Link to="/dashboard">Cancel</Link>
            </div> */}
            <br></br>
            {/* <p class="text-center text-gray-500 text-xs">
            &copy;Runtime Group
            </p> */}
        </form>
        
        

        {/* <section>
                <div className = "relative">
                    <button onClick={handleClick}>
                        <img src="" className="w-32 h-32 rounded-full object-cover mx-auto bg-gray-600"/>
                        <span class="absolute h-7 w-7 rounded-full bg-red-500 border-2 border-gray-500 top-3 right-0" />
                    </button>
                </div>
        </section> */}


        <section>
            <Card className="bg-white dark:bg-slate-700 py-8 px-8 rounded-lg">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Profile Picture</h1>
                        {/* <div>
                            <button className="w-32 h-32 rounded-full object-cover mx-auto bg-gray-600 dark:bg-white text-white" onClick={() => setIsOpen(true)}>Profile Icon</button>

                            {isOpen && (
                                <div className="my-6">
                                    <div className="my-6">
                                        {ProfileUpload()}
                                    </div>
                                    <button className = "text-white dark:text-black dark:bg-white bg-blue-500 px-2 rounded-lg" onClick={() => setIsOpen(false)}>Close</button>
                                </div>
                            )}
                        </div> */}
                    {ProfileUpload()}
                </div>
            </Card>

        </section>

        <section className="bg-white py-3 px-5 rounded-xl text-gray-500 dark:bg-slate-700 dark:text-white">
            <div>
                <Card className ="bg-white dark:bg-slate-700">
                    
                    <div>
                    Light Mode/Dark Mode
                    </div>
                    <>
                        <DarkModeSwitch
                            style={{ marginBottom: "2rem" }}
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            size={40}
                            
                        />
                    </>


                    <div>
                        Enable Activity Status
                    </div>
                    <Switch 
                    checked = {enabled}
                    onChange = {setEnabled}
                    className = {`${enabled ? 'bg-blue-600' : 'bg-gray-200'}
                    relative inline-flex items-center h-6 rounded-full w-11 duration-300`}
                    >
                    <span className = "sr-only">Enable Activity Status</span>
                    <span
                    className = {`${enabled ? 'translate-x-6' : 'translate-x-1'}
                    inline-block w-4 h-4 transform bg-white rounded-full`}/>
                    </Switch>
                </Card>
            </div>
        </section>
        <section>
            <div>
                <Card className="flex flex-col space-y-4 bg-white dark:bg-slate-700 text-black py-8 px-8 rounded-lg dark:placeholder:text-black">
                    <label className="text-black dark:text-white">{t('selector')}</label>

                    <select value={lang} 
                    onChange={handleChange}
                    className="">
                        {languages.map(item => {
                            return(<option key ={item.value}
                                value={item.value}>{item.text}</option>);
                        })}
                    </select>

                </Card>    
            </div>
        </section>
        
    </div>    
    )
}
