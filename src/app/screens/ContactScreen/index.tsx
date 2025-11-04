import { useStore } from "@/app/Store";

export const ContactScreen = () => {
  const store = useStore((state) => state);
  const { scene } = store;

  const visible = scene === "contact";

  return (
    <div className={`${visible ? "": "hidden"} w-full h-screen bg-gradient-to-r from-[pink]/60 to-[white]/60 transition-all duration-100 overflow-x-hidden overflow-y-scroll scrollbar-custom`}>
      <div className="w-full flex flex-col items-center justify-center my-40">
        <form className="flex flex-col items-center md:p-md md:max-w-[50%]" action="/send-mail" method="POST">
          <h2>Get in touch</h2>

          <label htmlFor="name" className="block text-[1.2rem] font-sans">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            className="mt-1 mb-4 block py-xs px-sm"
          />

          <label htmlFor="email" className="block text-[1.2rem] font-sans">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            required
            className="mt-1 mb-4 block py-xs px-sm"
          />

          <label htmlFor="subject" className="block text-[1.2rem] font-sans">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            required
            className="mt-1 mb-4 block py-xs px-sm"
          />

          <label htmlFor="message" className="block text-[1.2rem] font-sans">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            required
            className="mt-1 mb-4 block py-xs px-sm"
          ></textarea>

          <button
            type="submit"
            className="py-4 px-4 text-[2rem] md:text-[3rem] font-black"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
