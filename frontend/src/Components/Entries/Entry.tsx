import  {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSidebarOpen } from "../../redux/toggle";
import { getEntry, setActive, setEntry } from "../../redux/entry";
import  Picker  from "@emoji-mart/react";
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { useEditEntryMutation } from "../../api/entry";
init({ data })

interface EmojiInterface {
    id: string
    keywords: string[]
    name: string
    native: string
    shortcodes: string
    unified: string
}

interface EntryInterface {
  id: string;
  created_at: string;
  updated_at: string | null;
  content: string | null;
  emoji: string | null;
  emoji_name: string | null;
  title: string | null;
}


/*
 *  Component, Form for signing up an user.
 *
 * Props:
 *  signup: Function for signup a user.
 *  displayErrors: Function for setting errors
 * 
 * State: 
 *  formData: data input from form. Matches initial state fields
 * 
 * RouteList -> LoginForm
 */

function Entry({entry}: {entry: EntryInterface | null}) {
    const [editEntry, {isLoading}] = useEditEntryMutation()
    const sidebarState = useSelector(getSidebarOpen)
    const dispatch = useDispatch()
    const [togglePicker, setTogglePicker] = useState(false)
    
    console.log(entry)
    const initialForm = {
        title: entry?.title ||"",
        content: entry?.content||"",
        emoji: entry?.emoji||"",
        emoji_name: entry?.emoji_name||""
    }
    const [formData, setFormData] = useState(initialForm)

    useEffect(function () {
        console.log(formData)
    },[formData])

    
    /** handleChange: Handles change of form field.*/
    async function handleChange(evt : React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name , value } = evt.target as HTMLInputElement
        setFormData(oldData => ({...oldData ,[name]:value}))
        debounce(updateEntry, 2000)
    }
    
    async function updateEntry() {
        const entry: EntryInterface = await editEntry(formData).unwrap();
        console.log("UPDATE", entry)
        dispatch(setActive({entry}))
    }


    function handleEmoji(selected: EmojiInterface) {
        setFormData(prev => ({
            ...prev, 
            emoji:selected.native, 
            emoji_name: selected.name}))
        setTogglePicker(prev => !prev)
    }

    return (
        <div className={`bg-light-100 h-full ${sidebarState ? "col-span-12" : "col-span-15"} p-16`}>
            <form action="PATCH" className="flex flex-col grow min-h-full h-full">
                    <div className="absolute">
                        <label className="label" htmlFor="emoji" ></label>
                            { togglePicker ? <Picker data={data} onEmojiSelect={handleEmoji} /> :
                        <button className="p-2 border-3 rounded-md bg-primary-200"
                        onClick={() => setTogglePicker(prev => !prev)}>{formData.emoji || "😀"}</button>
                    }
                        <label className="label" htmlFor="title" ></label>
                        <input  
                        className="ml-4 input text-3xl  max-w-64 font-Raleway font-semibold"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <textarea className="textarea mt-20 min-h-full empty:before:content-['Today_I_am_feeling...']
                    empty:before:text-neutral-400 text-left outline-none" role="textbox" name="content"
                     onChange={handleChange} placeholder="Today I am feeling..."></textarea>
            </form>
        </div>
        )
}


export default Entry;