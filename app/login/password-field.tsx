"use client";
import { useState } from "react";
export default function PasswordField() {
 const [visible,setVisible]=useState(false);
 return <div className="an-secret"><input id="an-password" name="password" type={visible?"text":"password"} required autoComplete="current-password"/><button type="button" onClick={()=>setVisible(v=>!v)} aria-pressed={visible} aria-label={visible?"Hide password":"Show password"}>{visible?"Hide":"Show"}</button></div>;
}
