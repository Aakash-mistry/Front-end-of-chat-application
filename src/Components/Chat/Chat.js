import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../Textcontainer/TextContainer";

let socket;

const Chat = ({ location }) => {
	const [name, setName] = useState("");
	const [room, setRoom] = useState("");
	const [users, setUsers] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const ENDPOINT = "localhost:5000";
	useEffect(() => {
		const { name, room } = queryString.parse(location.search);
		socket = io(ENDPOINT);
		// console.log(name, room);
		setName(name);
		setRoom(room);
		socket.emit("join", { name, room }, (error) => {
			if (error) {
				alert(error);
			}
		});

		return () => {
			socket.emit("disconnect");

			socket.off();
		};

		// console.log(socket);
	}, [ENDPOINT, location.search]);

	useEffect(() => {
		socket.on("message", (message) => {
			setMessages((messages) => [...messages, message]);
		});
	}, []);

	// Send Message Function : Main function
	const sendMessage = (event) => {
		event.preventDefault(event);
		if (message) {
			socket.emit("sendMessage", message, () => setMessage(""));
		}
	};

	// console.log(message, messages);

	return (
		<div className='outerContainer'>
			<div className='container'>
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input
					message={message}
					setMessage={setMessage}
					sendMessage={sendMessage}
				/>
			</div>
			<TextContainer users={users} />
		</div>
	);
};

export default Chat;