import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

function SupportPage(){
  
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
  
    emailjs.sendForm("service_b0jkzjv", "template_dti8apf", form.current, "NaDh7LvjYW0WKJJaU")
      .then((result) => {
          console.log(result.text);
          console.log("message sent")
          e.target.reset() // this resets the forms 
      }, (error) => {
          console.log(error.text);
          console.log("unable to send message")
          e.target.reset() // this resets the forms 
      });
  };

  return (
    <div className="flex-col relative min-h-screen flex bg-blue-200 dark:bg-slate-800">
      <section id="home" className = "relative flex md:flex-row flex-col items-center justify-center">
        <div className="flex relative min-h-screen bg-no-repeat w-full bg-cover justify-center
            ">
            <div className="items-center relative flex justify-center ">
            <iframe width="800" height="600" src="https://www.youtube.com/embed/wQe41Azb_0U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
      </section>

      <div className="flex flex-row">
      <div className=" flex justify-center items-center h-screen w-2/3 p-20 ">
        <div className="container mx-auto bg-gray-100 dark:bg-slate-600 p-20 rounded-lg w-full">
          <h2 className="text-3xl dark:text-white font-bold mb-2">Contact Information</h2>
          <p className="text-xl text-gray-500 dark:text-blue-100 mb-8">Our team is ready to answer your questions!</p>
          <p className="text-xl text-gray-700 dark:text-white mb-2">1250 Bellflower Blvd.</p>
          <p className="text-xl text-gray-700 dark:text-white mb-2">Long Beach, CA 90840</p>
          <p className="text-xl text-gray-700 dark:text-white mb-2">Phone: (562) 985-4111</p>
          <p className="text-xl text-gray-700 dark:text-white mb-2"><a href="mailto:runtime.live@outlook.com">Email: runtime.live@outlook.com</a></p>
        </div>
      </div>

      <div className="flex justify-center items-center h-screen  w-1/3 " >
        <div className= "container mx-auto bg-gray-100 dark:bg-slate-600 p-20 rounded-lg max-w-md w-full ">
          <form ref={form} onSubmit={sendEmail} className="w-full">
            <h2 className="text-xl dark:text-white font-bold mb-2 items-center flex justify-center">Get in touch with us:</h2>
            <div className="mb-4">
              <label className="block text-lg text-gray-700 dark:text-blue-100 font-bold mb-2" htmlFor="name">Name</label>
              <input className="appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="user_name" />
            </div>
            <div className="mb-4">
              <label className="block text-lg text-gray-700 dark:text-blue-100 font-bold mb-2" htmlFor="email">Email</label>
              <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" name="user_email" />
            </div>
            <div className="mb-4">
              <label className="block text-lg text-gray-700 dark:text-blue-100 font-bold mb-2" htmlFor="message">Message</label>
              <textarea className="appearance-none border rounded w-full h-32 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="message" />
            </div>
            <div className="flex justify-end">
              <input className="bg-blue-500 hover:bg-blue-700 text-lg text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" value="Send" />
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}

export default SupportPage;
