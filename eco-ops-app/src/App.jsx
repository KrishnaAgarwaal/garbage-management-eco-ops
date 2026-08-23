import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// --- Helper Components ---

const Icon = ({ path, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className={className} {...props}>
    <path d={path} />
  </svg>
);
const LeafIcon = (props) => <Icon path="M8 16a8 8 0 0 0 8-8c0-2.02-1.12-4.04-3.02-5.46A8.003 8.003 0 0 0 8 0a8 8 0 0 0-8 8c0 4.42 3.58 8 8 8zM6.5 5A1.5 1.5 0 1 1 5 6.5 1.5 1.5 0 0 1 6.5 5zm3.5 2A1.5 1.5 0 1 1 8.5 8.5 1.5 1.5 0 0 1 10 7zm-3.5 4A1.5 1.5 0 1 1 5 12.5 1.5 1.5 0 0 1 6.5 11z" {...props} />;
const UserIcon = (props) => <Icon path="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" {...props} />;
const CameraIcon = (props) => <Icon path="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 7.172 3h1.656a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828-.828A2 2 0 0 1 3.172 4H2z M8 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" {...props} />;
const PinIcon = (props) => <Icon path="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" {...props} />;
const ArrowRightCircleIcon = (props) => <Icon path="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" {...props} />;
const CheckCircleIcon = (props) => <Icon path="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" {...props} />;
const BinIcon = (props) => <Icon path="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z M4.5 3.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1H4v-1zM3 1.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-10z" {...props} />;
const BellIcon = (props) => <Icon path="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" {...props} />;
const GearIcon = (props) => <Icon path="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z M8 1a.5.5 0 0 1 .5.5v1.273a.5.5 0 0 1-.223.416l-.884.51a.5.5 0 0 1-.6.039l-1.028-.619a.5.5 0 0 1-.247-.562l.255-1.1a.5.5 0 0 1 .45-.357A.5.5 0 0 1 8 1zm3.89 1.447a.5.5 0 0 1 .632.062l.857.857a.5.5 0 0 1 0 .707l-.619 1.028a.5.5 0 0 1-.562.247l-1.1-.255a.5.5 0 0 1-.357-.45.5.5 0 0 1 .039-.6l.51-.884a.5.5 0 0 1 .416-.223h1.273a.5.5 0 0 1 .5.5v-1.273a.5.5 0 0 1 .223-.416l.884-.51a.5.5 0 0 1 .6-.039l1.028.619a.5.5 0 0 1 .247.562l-.255 1.1a.5.5 0 0 1-.45.357A.5.5 0 0 1 15 8h-1.273a.5.5 0 0 1-.416.223l-.51.884a.5.5 0 0 1-.039.6l.619 1.028a.5.5 0 0 1-.247.562l-1.1.255a.5.5 0 0 1-.45-.357A.5.5 0 0 1 11.89 14.553l-.062-.632a.5.5 0 0 1 .062-.632l.857-.857a.5.5 0 0 1 .707 0l1.028.619a.5.5 0 0 1 .247.562l-.255 1.1a.5.5 0 0 1-.45.357A.5.5 0 0 1 15 15h1.273a.5.5 0 0 1 .416-.223l.51-.884a.5.5 0 0 1 .6-.039l1.028.619a.5.5 0 0 1 .247.562l-.255 1.1a.5.5 0 0 1-.45.357A.5.5 0 0 1 15 16h-1.273a.5.5 0 0 1-.416-.223l-.51-.884a.5.5 0 0 1-.039-.6l.619-1.028a.5.5 0 0 1 .247-.562l1.1-.255a.5.5 0 0 1 .45.357a.5.5 0 0 1-.062.632l-.857.857a.5.5 0 0 1-.707 0l-1.028-.619a.5.5 0 0 1-.247-.562l.255-1.1a.5.5 0 0 1 .45-.357A.5.5 0 0 1 13.727 15h1.273a.5.5 0 0 1 .5.5v1.273a.5.5 0 0 1-.223.416l-.884.51a.5.5 0 0 1-.6.039l-1.028-.619a.5.5 0 0 1-.247-.562l.255-1.1a.5.5 0 0 1 .45-.357A.5.5 0 0 1 16 13.727v-1.273a.5.5 0 0 1-.223-.416l-.884-.51a.5.5 0 0 1-.6-.039l-1.028.619a.5.5 0 0 1-.247-.562l-.255 1.1a.5.5 0 0 1-.45.357A.5.5 0 0 1 11.89 16h-1.273a.5.5 0 0 1-.416.223l-.51.884a.5.5 0 0 1-.6.039l-1.028-.619a.5.5 0 0 1-.247-.562l.255-1.1a.5.5 0 0 1 .45-.357A.5.5 0 0 1 8 16a.5.5 0 0 1-.5-.5v-1.273a.5.5 0 0 1 .223-.416l.884-.51a.5.5 0 0 1 .6.039l1.028.619a.5.5 0 0 1 .247.562l-.255 1.1a.5.5 0 0 1-.45.357A.5.5 0 0 1 8 15h-1.273a.5.5 0 0 1-.416-.223l-.51-.884a.5.5 0 0 1-.039-.6l.619-1.028a.5.5 0 0 1 .247-.562l1.1-.255a.5.5 0 0 1 .45.357a.5.5 0 0 1-.062.632l-.857.857a.5.5 0 0 1-.707 0l-1.028-.619a.5.5 0 0 1-.247-.562l.255-1.1a.5.5 0 0 1 .45-.357A.5.5 0 0 1 4.11 1.447l.062.632a.5.5 0 0 1-.062.632L3.253 3.57a.5.5 0 0 1-.707 0L1.518 2.54a.5.5 0 0 1-.247-.562l.255-1.1a.5.5 0 0 1 .45-.357A.5.5 0 0 1 2.253.062l1.028.619a.5.5 0 0 1 .247.562l-.255 1.1a.5.5 0 0 1-.45.357A.5.5 0 0 1 1.273 2.5H0a.5.5 0 0 1-.5-.5V1a.5.5 0 0 1 .5-.5h1.273a.5.5 0 0 1 .416.223l.51.884a.5.5 0 0 1 .039.6l-.619 1.028a.5.5 0 0 1-.562.247l-1.1-.255a.5.5 0 0 1-.357-.45A.5.5 0 0 1 1.447.11l.632-.062a.5.5 0 0 1 .632.062l.857.857a.5.5 0 0 1 0 .707L2.54 2.518a.5.5 0 0 1-.562.247l-1.1-.255a.5.5 0 0 1-.357-.45A.5.5 0 0 1 1.062.11L.43 1.138a.5.5 0 0 1-.062.632l.857.857a.5.5 0 0 1 .707 0l1.028-.619a.5.5 0 0 1 .562.247l.255 1.1a.5.5 0 0 1-.357.45A.5.5 0 0 1 2.5 4.11v1.273a.5.5 0 0 1-.223.416l-.884.51a.5.5 0 0 1-.6.039l-1.028-.619a.5.5 0 0 1-.247-.562l.255-1.1a.5.5 0 0 1 .45-.357A.5.5 0 0 1 0 2.273V1a.5.5 0 0 1 .5-.5z" {...props} />;
const FlagIcon = (props) => <Icon path="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.5.5h-6.586a.5.5 0 0 0-.354.146l-4 4 .708.708L8.707 8.5H14.5A.5.5 0 0 1 15 8V.5a.5.5 0 0 1-.222-.415l-11-2A.5.5 0 0 1 3.5 0h11.278zM3.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-1z" {...props} />;
const DirectionsIcon = (props) => <Icon path="M8 1a.5.5 0 0 1 .5.5V5h1.5a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V6H6a.5.5 0 0 1 0-1h1.5V1.5A.5.5 0 0 1 8 1zM8 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 2A3 3 0 1 0 8 2a3 3 0 0 0 0 6zM4 11.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5-2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>;
const EmailIcon = (props) => <Icon path="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" {...props} />;
const LockIcon = (props) => <Icon path="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" {...props} />;
const HomeIcon = (props) => <Icon path="m8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" {...props} />;
const MapIcon = (props) => <Icon path="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" {...props} />;
const ScanIcon = (props) => <Icon path="M6 .5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 6 .5zm-2 5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H4z" {...props} />;
const LearnIcon = (props) => <Icon path="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 4.5A.5.5 0 0 0 .5 7V14a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.289-.453l-7.5-4.5zM8 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5zM15 12h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0H5v-2h2v2zM3 12H1v-2h2v2z" {...props}/>;
const ProfileIcon = (props) => <Icon path="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" {...props}/>;
const ShopUiIcon = (props) => <Icon path="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" {...props}/>;
const EcoOpsLogo = ({ size = 64, showText = false }) => (
    <div className="d-flex align-items-center gap-2">
        <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M67.5,20.2a35,35 0 1 0 0,59.6 M32.5,79.8a35,35 0 1 0 0,-59.6" fill="none" stroke="#34D399" strokeWidth="8" strokeLinecap="round" transform="rotate(15, 50, 50)"/>
            <path d="M32.5,20.2a35,35 0 1 1 0,59.6" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" transform="rotate(15, 50, 50)"/>
            <path d="M50,30 C40,45 40,55 50,70 C60,55 60,45 50,30 Z" fill="#10B981"/>
            <path d="M50,30 C55,45 55,55 50,70" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {showText && <h1 className="fw-bold fs-2 mb-0">EcoOps</h1>}
    </div>
);
// Map Marker Icons
const RecyclingMarker = (props) => <svg width="32" height="32" viewBox="0 0 24 24" {...props}><path fill="#28a745" d="M9.5 19q-1.35 0-2.325-.975T6.2 15.7h1.5q0 .8.575 1.375T9.5 17.65q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T8 16.95q0 1.35.975 2.325T11.3 20.2v1.5q-1.95 0-3.325-1.375T6.6 17.1H5.1q0 1.95 1.375 3.325T9.8 21.8v1.2H7v-1.5H5.8v-1.2h4l-2.85-2.85q-.3.2-.625.338T5.5 18.25q-1.35 0-2.325-.975T2.2 15h1.5q0 .8.575 1.375T5.5 16.95q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T4 15.45q0 1.35.975 2.325T7.3 18.7v1.5q-1.95 0-3.325-1.375T2.6 15.9H1.1q0 1.95 1.375 3.325T5.8 20.6v1.2H3v-1.5H1.8v-1.2H6l-3.8-3.8q-.3.2-.625.338T.5 16.75q-1.35 0-2.325-.975T-2.8 13.5h1.5q0 .8.575 1.375T.5 15.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-2 14.2q0 1.35.975 2.325T1.3 17.5v1.5q-1.95 0-3.325-1.375T-3.4 14.7H-5q0 1.95 1.375 3.325T-0.2 19.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-1.8 14q-.3.2-.625.338T-3.25 14.8q-1.35 0-2.325-.975T-6.55 11.5h1.5q0 .8.575 1.375T-3.25 13.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-5.5 12.7q0 1.35.975 2.325T-2.2 16v1.5q-1.95 0-3.325-1.375T-6.9 13.2H-8.4q0 1.95 1.375 3.325T-3.7 17.9v1.2h-2.8v-1.5H-7.7v-1.2h4.3L-7.2 13q-.3.2-.625.338T-8.5 13.5q-1.35 0-2.325-.975T-11.8 10.2h1.5q0 .8.575 1.375T-8.5 12.15q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-10.75 11.2q0 1.35.975 2.325T-7.4 14.8v1.5q-1.95 0-3.325-1.375T-12.1 11.7h-1.5q0 1.95 1.375 3.325T-8.8 16.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-12.3 10q-.3.2-.625.338T-13.75 10.8q-1.35 0-2.325-.975T-17.05 7.5h1.5q0 .8.575 1.375T-13.75 9.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-16 8.2q0 1.35.975 2.325T-12.7 11.8v1.5q-1.95 0-3.325-1.375T-17.4 8.7h-1.5q0 1.95 1.375 3.325T-14.2 13.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-17.7 7q-.3.2-.625.338T-19 7.8q-1.35 0-2.325-.975T-22.3 4.5h1.5q0 .8.575 1.375T-19 6.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-21.25 5.2q0 1.35.975 2.325T-17.9 8.8v1.5q-1.95 0-3.325-1.375T-22.6 5.7h-1.5q0 1.95 1.375 3.325T-19.4 10.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-23.1 4q-.3.2-.625.338T-24.5 4.8q-1.35 0-2.325-.975T-27.8 1.5h1.5q0 .8.575 1.375T-24.5 3.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-26.75 2.2q0 1.35.975 2.325T-23.4 5.8v1.5q-1.95 0-3.325-1.375T-28 2.7h-1.5q0 1.95 1.375 3.325T-24.8 7.4v1.2h-2.8V7.1h-1.2V5.9h4.3l-5.3-5.3H9.5v4.3h1.2V6.2h1.5V3.4H9.5V2.2H11V.7h1.2v1.5h1.2V.7h1.2v1.5h2.8v1.2H16v1.5h1.5v2.8h-1.5v1.2h-1.2v1.5h-1.5v1.2h-1.2v2.8h-1.5v1.2H11v1.5H9.8v1.2H7V19H5.8v1.2h4l-2.85-2.85q-.3.2-.625.338T5.5 18.25q-1.35 0-2.325-.975T2.2 15h1.5q0 .8.575 1.375T5.5 16.95q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T4 15.45q0 1.35.975 2.325T7.3 18.7v1.5q-1.95 0-3.325-1.375T2.6 15.9H1.1q0 1.95 1.375 3.325T5.8 20.6v1.2H3v-1.5H1.8v-1.2H6l-3.8-3.8q-.3.2-.625.338T.5 16.75q-1.35 0-2.325-.975T-2.8 13.5h1.5q0 .8.575 1.375T.5 15.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-2 14.2q0 1.35.975 2.325T1.3 17.5v1.5q-1.95 0-3.325-1.375T-3.4 14.7H-5q0 1.95 1.375 3.325T-0.2 19.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-1.8 14q-.3.2-.625.338T-3.25 14.8q-1.35 0-2.325-.975T-6.55 11.5h1.5q0 .8.575 1.375T-3.25 13.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-5.5 12.7q0 1.35.975 2.325T-2.2 16v1.5q-1.95 0-3.325-1.375T-6.9 13.2H-8.4q0 1.95 1.375 3.325T-3.7 17.9v1.2h-2.8v-1.5H-7.7v-1.2h4.3L-7.2 13q-.3.2-.625.338T-8.5 13.5q-1.35 0-2.325-.975T-11.8 10.2h1.5q0 .8.575 1.375T-8.5 12.15q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-10.75 11.2q0 1.35.975 2.325T-7.4 14.8v1.5q-1.95 0-3.325-1.375T-12.1 11.7h-1.5q0 1.95 1.375 3.325T-8.8 16.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-12.3 10q-.3.2-.625.338T-13.75 10.8q-1.35 0-2.325-.975T-17.05 7.5h1.5q0 .8.575 1.375T-13.75 9.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-16 8.2q0 1.35.975 2.325T-12.7 11.8v1.5q-1.95 0-3.325-1.375T-17.4 8.7h-1.5q0 1.95 1.375 3.325T-14.2 13.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-17.7 7q-.3.2-.625.338T-19 7.8q-1.35 0-2.325-.975T-22.3 4.5h1.5q0 .8.575 1.375T-19 6.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-21.25 5.2q0 1.35.975 2.325T-17.9 8.8v1.5q-1.95 0-3.325-1.375T-22.6 5.7h-1.5q0 1.95 1.375 3.325T-19.4 10.4v1.2h-2.8v-1.5h-1.2v-1.2h4.3L-23.1 4q-.3.2-.625.338T-24.5 4.8q-1.35 0-2.325-.975T-27.8 1.5h1.5q0 .8.575 1.375T-24.5 3.45q.2 0 .4-.025t.375-.125l-2.1-2.1q-.15.35-.225.738T-26.75 2.2q0 1.35.975 2.325T-23.4 5.8v1.5q-1.95 0-3.325-1.375T-28 2.7h-1.5q0 1.95 1.375 3.325T-24.8 7.4v1.2h-2.8V7.1h-1.2V5.9h4.3l-5.3-5.3z"/></svg>;
const ScrapMarker = () => <svg width="32" height="32" viewBox="0 0 24 24"><path fill="#fd7e14" d="M5 21V6q0-.825.588-1.413T7 4h10q.825 0 1.413.588T19 6v15zm2-2h10V6H7zm2-2h2V8H9zm4 0h2V8h-2zM4 3V1h16v2h-4.15l-1.6-2h-4.5l-1.6 2z"/></svg>;
const CompostMarker = () => <svg width="32" height="32" viewBox="0 0 24 24"><path fill="#6f42c1" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.138-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m-5-9q.625 0 1.063-.438T8.5 11.5q0-.625-.438-1.063T7 10q-.625 0-1.063.438T5.5 11.5q0 .625.438 1.063T7 13m5 5q.625 0 1.063-.438T13.5 16.5q0-.625-.438-1.063T12 15q-.625 0-1.063.438T10.5 16.5q0 .625.438 1.063T12 18m5-5q.625 0 1.063-.438T18.5 11.5q0-.625-.438-1.063T17 10q-.625 0-1.063.438T15.5 11.5q0 .625.438 1.063T17 13"/></svg>;
const HazardousMarker = () => <svg width="32" height="32" viewBox="0 0 24 24"><path fill="#dc3545" d="M12 22L1 21l11-19l11 19zM11 14v-4h2v4zm0 4v-2h2v2z"/></svg>;
const TruckMarker = (props) => <Icon path="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732l.5-.25a.5.5 0 0 1 .5.432V11h1.5a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4.5a2.5 2.5 0 0 1-5 0V6h-1.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5H6a2.5 2.5 0 0 1 5 0v.5h.5a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1-4 0a2 2 0 0 1 4 0zm-6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" {...props} />;


// --- App Structure ---

export default function App() {
    // Attempt to load user profile from session storage, or use a default
    const getInitialProfile = () => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            return JSON.parse(storedProfile);
        }
        return { 
            name: 'John Smith', 
            location: 'Chennai, India', 
            profilePic: null,
            points: 12500,
            recycledCount: 247,
            rank: 128
        };
    };

    const [userProfile, setUserProfile] = useState(getInitialProfile);
    const [isProfileSetup, setIsProfileSetup] = useState(!!sessionStorage.getItem('isProfileSetup'));

    const addPoints = (amount) => {
        setUserProfile(prev => {
            const updated = {
                ...prev,
                points: prev.points + amount,
                rank: Math.max(1, prev.rank - Math.floor(amount / 500))
            };
            sessionStorage.setItem('userProfile', JSON.stringify(updated));
            return updated;
        });
    };

    const addRecycledItems = (count) => {
        setUserProfile(prev => {
            const pointsEarned = count * 10;
            const updated = {
                ...prev,
                recycledCount: prev.recycledCount + count,
                points: prev.points + pointsEarned,
                rank: Math.max(1, prev.rank - Math.floor(pointsEarned / 500))
            };
            sessionStorage.setItem('userProfile', JSON.stringify(updated));
            return updated;
        });
    };

    const deductPoints = (amount) => {
        let success = false;
        setUserProfile(prev => {
            if (prev.points >= amount) {
                success = true;
                const updated = {
                    ...prev,
                    points: prev.points - amount
                };
                sessionStorage.setItem('userProfile', JSON.stringify(updated));
                return updated;
            }
            return prev;
        });
        return success;
    };

    // Determine the initial view based on login and profile setup status
    const getInitialView = () => {
        const isLoggedIn = !!sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            return isProfileSetup ? 'mainApp' : 'setupProfile';
        }
        return 'login';
    };

    const [view, setView] = useState(getInitialView());

    const handleSetView = (newView) => {
        if (newView === 'login') {
            sessionStorage.clear();
            setIsProfileSetup(false);
        } else {
            sessionStorage.setItem('isLoggedIn', 'true');
        }
        setView(newView);
    };
    
    const handleProfileUpdate = (newProfile) => {
        setUserProfile(prev => {
            const updated = {
                ...prev,
                ...newProfile
            };
            sessionStorage.setItem('userProfile', JSON.stringify(updated));
            return updated;
        });
        sessionStorage.setItem('isProfileSetup', 'true');
        setIsProfileSetup(true);
        handleSetView('mainApp');
    };

    const renderView = () => {
        switch (view) {
            case 'login':
                return <LoginScreen setView={handleSetView} />;
            case 'setupProfile':
                return <ProfileForm onSave={handleProfileUpdate} />;
            case 'mainApp':
                return (
                    <MainApp 
                        setView={handleSetView} 
                        userProfile={userProfile} 
                        onProfileUpdate={handleProfileUpdate} 
                        addPoints={addPoints}
                        addRecycledItems={addRecycledItems}
                        deductPoints={deductPoints}
                    />
                );
            default:
                return <LoginScreen setView={handleSetView} />;
        }
    };
    
    return (
        <div className="bg-light font-family-sans-serif min-vh-100 d-flex justify-content-center align-items-stretch">
            {view === 'mainApp' ? (
                <div className="w-100 min-vh-100">
                    {renderView()}
                </div>
            ) : (
                <div className="d-flex align-items-center justify-content-center w-100 p-3">
                    <div 
                        className="bg-white shadow-lg position-relative rounded-4 overflow-hidden" 
                        style={{
                            width: '414px', 
                            height: '896px', 
                            maxWidth: '100vw', 
                            maxHeight: '100vh',
                        }}
                    >
                        {renderView()}
                    </div>
                </div>
            )}
        </div>
    );
}


// --- Main Application for Consumers ---

const TopHeader = ({ userName }) => (
    <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <p className="text-secondary small mb-0">Welcome Back,</p>
            <h1 className="fw-bold fs-4 text-body mb-0">{userName}</h1>
        </div>
        <div className="d-flex align-items-center gap-3">
            <BellIcon className="text-secondary" />
            <GearIcon className="text-secondary" />
        </div>
    </div>
);

const MainApp = ({ setView, userProfile, onProfileUpdate, addPoints, addRecycledItems, deductPoints }) => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleProfileSave = (updatedProfile) => {
      onProfileUpdate(updatedProfile);
      setIsEditingProfile(false);
  };
  
  if (isEditingProfile) {
      return (
          <div className="d-flex flex-column h-100 bg-white">
              <div className="flex-grow-1 overflow-y-auto p-3 mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
                  <ProfileForm 
                      isEditing={true}
                      currentProfile={userProfile}
                      onSave={handleProfileSave}
                      onCancel={() => setIsEditingProfile(false)}
                  />
              </div>
          </div>
      );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Dashboard userProfile={userProfile} addPoints={addPoints} />;
      case 'Map':
        return <InteractiveMap />;
      case 'Scan':
        return <AIClassification addRecycledItems={addRecycledItems} />;
      case 'Shop':
        return <Marketplace userProfile={userProfile} deductPoints={deductPoints} />;
       case 'Learn':
        return <LearningModules addPoints={addPoints} />;
      case 'Profile':
        return <Profile setView={setView} userProfile={userProfile} onEdit={() => setIsEditingProfile(true)} />;
      default:
        return <Dashboard userProfile={userProfile} addPoints={addPoints} />;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light w-100">
        {/* --- DESKTOP SIDEBAR NAVIGATION (Visible on md and up) --- */}
        <div className="d-none d-md-flex flex-column bg-white border-end py-4 px-3" style={{ width: '280px', flexShrink: 0 }}>
            {/* Logo */}
            <div className="mb-4 ps-2">
                <EcoOpsLogo size={48} showText={true} />
            </div>

            {/* User Mini Profile */}
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 mb-4">
                <div className="p-1 rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                    {userProfile.profilePic ? (
                        <img src={userProfile.profilePic} alt="Profile" className="rounded-circle w-100 h-100" style={{ objectFit: 'cover' }}/>
                    ) : (
                        <UserIcon className="text-secondary" style={{ width: '24px', height: '24px' }}/>
                    )}
                </div>
                <div className="overflow-hidden">
                    <p className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.95rem' }}>{userProfile.name}</p>
                    <span className="badge bg-success-subtle text-success-emphasis" style={{ fontSize: '0.75rem' }}>
                        {userProfile.points.toLocaleString()} pts
                    </span>
                </div>
            </div>

            {/* Menu Links */}
            <div className="d-flex flex-column gap-1 flex-grow-1">
                {[
                    { name: 'Home', label: 'Dashboard', icon: <HomeIcon style={{ width: '18px', height: '18px' }} /> },
                    { name: 'Map', label: 'Interactive Map', icon: <MapIcon style={{ width: '18px', height: '18px' }} /> },
                    { name: 'Scan', label: 'Scan & Classify', icon: <ScanIcon style={{ width: '18px', height: '18px' }} /> },
                    { name: 'Shop', label: 'Eco Shop', icon: <ShopUiIcon style={{ width: '18px', height: '18px' }} /> },
                    { name: 'Learn', label: 'Learn & Quiz', icon: <LearnIcon style={{ width: '18px', height: '18px' }} /> },
                    { name: 'Profile', label: 'My Profile', icon: <ProfileIcon style={{ width: '18px', height: '18px' }} /> },
                ].map(item => (
                    <button
                        key={item.name}
                        onClick={() => setCurrentPage(item.name)}
                        className={`btn text-start d-flex align-items-center gap-3 py-2 px-3 rounded-3 border-0 transition ${
                            currentPage === item.name ? 'btn-success text-white shadow-sm' : 'text-secondary bg-transparent'
                        }`}
                        style={{ fontSize: '0.95rem' }}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Log Out */}
            <button 
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
                onClick={() => setView('login')}
            >
                Log Out
            </button>
        </div>

        {/* --- MAIN PAGE CONTENT WRAPPER --- */}
        <div className="flex-grow-1 d-flex flex-column min-vh-100 overflow-hidden position-relative">
            {/* Mobile layout */}
            <div className="d-md-none d-flex flex-column flex-grow-1 overflow-hidden" style={{ height: '100vh' }}>
                <div className={`flex-grow-1 overflow-y-auto ${currentPage !== 'Map' ? 'p-3' : ''}`}>
                    {currentPage !== 'Profile' && currentPage !== 'Map' && <TopHeader userName={userProfile.name} />}
                    {renderPage()}
                </div>
                <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>

            {/* Desktop layout */}
            <div className="d-none d-md-flex flex-column flex-grow-1 min-vh-100 overflow-hidden">
                <div className="border-bottom py-3 px-4 d-flex justify-content-between align-items-center bg-white shadow-sm">
                    <h2 className="fw-bold fs-4 mb-0 text-dark">
                        {currentPage === 'Home' ? 'Dashboard' : currentPage === 'Shop' ? 'Eco Shop' : currentPage === 'Scan' ? 'Community Action' : currentPage === 'Learn' ? 'Training Modules' : currentPage}
                    </h2>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-secondary small">{userProfile.location || 'Chennai, India'}</span>
                        <BellIcon className="text-secondary" style={{ cursor: 'pointer' }} />
                        <GearIcon className="text-secondary" style={{ cursor: 'pointer' }} />
                    </div>
                </div>
                <div className="flex-grow-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 65px)', backgroundColor: '#f8f9fa' }}>
                    <div className="mx-auto" style={{ maxWidth: '960px' }}>
                        {renderPage()}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}


// --- Login and Page Components ---

const LoginScreen = ({ setView }) => {
    const [loginType, setLoginType] = useState('customer'); // 'customer' or 'worker'

    const handleLogin = () => {
        if (loginType === 'customer') {
            const isProfileSetup = !!sessionStorage.getItem('isProfileSetup');
            setView(isProfileSetup ? 'mainApp' : 'setupProfile');
        } else {
            alert('Worker login coming soon!');
        }
    };
    
    const loginButtonStyle = {
        background: 'linear-gradient(90deg, #34D399 0%, #3B82F6 100%)',
        border: 'none'
    };

    return (
        <div 
            className="d-flex flex-column justify-content-center h-100 p-4"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=2070')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div 
                className="d-flex flex-column gap-4 text-center p-4 rounded-4"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <div className="mx-auto">
                    <EcoOpsLogo size={80} showText={true} />
                </div>
                
                <div className="btn-group w-100">
                    <button 
                        className={`btn ${loginType === 'customer' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setLoginType('customer')}
                    >
                        Customer
                    </button>
                    <button 
                        className={`btn ${loginType === 'worker' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setLoginType('worker')}
                    >
                        Worker
                    </button>
                </div>

                <div className="position-relative">
                    <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">
                        {loginType === 'customer' ? <EmailIcon /> : <UserIcon />}
                    </span>
                    <input 
                        type={loginType === 'customer' ? 'email' : 'text'} 
                        className="form-control p-3 ps-5" 
                        placeholder={loginType === 'customer' ? 'Email Address' : 'Worker ID'} 
                    />
                </div>
                <div className="position-relative">
                     <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">
                        <LockIcon />
                    </span>
                    <input type="password" className="form-control p-3 ps-5" placeholder="Password" />
                </div>

                <div className="d-flex justify-content-between align-items-center text-secondary small">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">
                            Remember me
                        </label>
                    </div>
                    <a href="#" className="text-decoration-none">Forgot Password?</a>
                </div>

                <button className="btn btn-lg w-100 py-3 fw-semibold text-white" style={loginButtonStyle} onClick={handleLogin}>
                    LOG IN
                </button>

                 <div className="d-flex align-items-center my-1">
                    <hr className="flex-grow-1"/>
                    <span className="px-3 text-secondary small">OR</span>
                    <hr className="flex-grow-1"/>
                </div>

                 <button className="btn btn-light btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm" onClick={() => alert('Sign up coming soon!')}>
                    <span className="fw-semibold">Sign Up</span>
                </button>
            </div>
        </div>
    );
};

const ProfileForm = ({ isEditing = false, currentProfile = { name: '', location: '', profilePic: null }, onSave, onCancel }) => {
    const [name, setName] = useState(currentProfile.name);
    const [location, setLocation] = useState(currentProfile.location);
    const [selectedAvatar, setSelectedAvatar] = useState(currentProfile.profilePic);
    
    const avatars = [
        'https://api.dicebear.com/8.x/adventurer/svg?seed=Mimi',
        'https://api.dicebear.com/8.x/adventurer/svg?seed=Bandit',
        'https://api.dicebear.com/8.x/adventurer/svg?seed=Sheba',
        'https://api.dicebear.com/8.x/adventurer/svg?seed=Rocky',
    ];

    const handleSubmit = () => {
        if (!name || !location || !selectedAvatar) {
            alert('Please fill in all fields and select an avatar.');
            return;
        }
        onSave({ name, location, profilePic: selectedAvatar });
    };

    return (
        <div className="d-flex flex-column gap-4 p-3">
            <h1 className="fs-2 fw-bold text-center">{isEditing ? 'Edit Profile' : 'Setup Your Profile'}</h1>
            <p className="text-secondary text-center small mt-n3">{isEditing ? 'Update your details below.' : 'Welcome! Let\'s get your profile ready.'}</p>
            
            <div className="d-flex flex-column align-items-center">
                 <p className="fw-semibold">Choose Your Avatar</p>
                 <div className="d-flex gap-3 mb-3">
                     {avatars.map(avatar => (
                         <img 
                            key={avatar}
                            src={avatar} 
                            alt="avatar"
                            className={`rounded-circle ${selectedAvatar === avatar ? 'border border-success border-3' : ''}`}
                            style={{width: '60px', height: '60px', cursor: 'pointer'}}
                            onClick={() => setSelectedAvatar(avatar)}
                         />
                     ))}
                 </div>
            </div>

            <div className="form-floating">
                <input type="text" className="form-control" id="nameInput" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                <label htmlFor="nameInput">Full Name</label>
            </div>
            <div className="form-floating">
                <input type="text" className="form-control" id="locationInput" placeholder="Location (e.g., Chennai, India)" value={location} onChange={e => setLocation(e.target.value)} />
                <label htmlFor="locationInput">Location (e.g., Chennai, India)</label>
            </div>

            <button className="btn btn-success btn-lg w-100 py-3 fw-semibold" onClick={handleSubmit}>
                {isEditing ? 'Save Changes' : 'Complete Setup'}
            </button>
            {isEditing && (
                <button className="btn btn-outline-secondary w-100 py-2" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </div>
    );
};

const Dashboard = ({ userProfile, addPoints }) => {
    const [leaderboardTab, setLeaderboardTab] = useState('individual'); // 'individual' or 'locality'
    const [challengeCompleted, setChallengeCompleted] = useState(false);

    const individualData = [
        { name: 'John S.', points: 15000 },
        { name: 'Jane D.', points: 14200 },
        { name: 'Mike L.', points: 13800 },
    ];

    const localityData = [
        { name: 'Velachery', points: 125000 },
        { name: 'Adyar', points: 112800 },
        { name: 'Guindy', points: 98500 },
    ];

    const recentActivity = [
        { id: 1, action: "Recycled plastic bottle", points: "+10", time: "2h ago" },
        { id: 2, action: "Redeemed coffee voucher", points: "-1500", time: "1d ago" },
        { id: 3, action: "Completed weekly challenge", points: "+500", time: "3d ago" },
    ];
    
    const leaderboardData = leaderboardTab === 'individual' ? individualData : localityData;

    const stats = [
        {label: "Recycled", value: userProfile.recycledCount.toString(), icon: <LeafIcon/>, color: "success"},
        {label: "Points", value: userProfile.points.toLocaleString(), icon: <UserIcon/>, color: "primary"},
        {label: "Rank", value: `#${userProfile.rank}`, icon: <PinIcon/>, color: "info"},
    ]

    return (
      <div className="d-flex flex-column gap-4">
          <div className="row g-3">
             {stats.map(stat => (
                 <div key={stat.label} className="col-4">
                     <div className={`bg-${stat.color}-subtle p-3 rounded-4 text-center shadow-sm`}>
                         <div className={`text-${stat.color} mb-1`}>{stat.icon}</div>
                         <p className="fw-bold fs-5 mb-0">{stat.value}</p>
                         <p className="small text-secondary mb-0">{stat.label}</p>
                     </div>
                 </div>
             ))}
          </div>

        <div className="p-4 bg-primary-subtle rounded-4">
            <h3 className="fw-bold fs-5 mb-2">Daily Challenge</h3>
            <p className="small text-secondary">Scan and classify 5 plastic bottles today to earn extra points!</p>
            {challengeCompleted ? (
                 <button className="btn btn-success w-100" disabled>
                    <CheckCircleIcon className="me-2"/> Completed! (+150 pts)
                 </button>
            ) : (
                 <button className="btn btn-primary w-100" onClick={() => { setChallengeCompleted(true); addPoints(150); }}>
                    Complete Challenge
                 </button>
            )}
        </div>
        
         <div className="p-4 bg-body-tertiary rounded-4">
             <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold fs-5 mb-0">Leaderboard</h3>
                <div className="btn-group btn-group-sm">
                    <button 
                        className={`btn ${leaderboardTab === 'individual' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setLeaderboardTab('individual')}
                    >
                        Individual
                    </button>
                    <button 
                        className={`btn ${leaderboardTab === 'locality' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setLeaderboardTab('locality')}
                    >
                        Locality
                    </button>
                </div>
             </div>
             <ul className="list-unstyled d-flex flex-column gap-3">
                {leaderboardData.map((item, index) => (
                    <li key={index} className="d-flex align-items-center">
                        <span className="fw-bold me-3">{index + 1}</span>
                        <div className="bg-secondary-subtle p-2 rounded-circle me-3">
                            <UserIcon className="text-secondary"/>
                        </div>
                        <span className="flex-grow-1">{item.name}</span>
                        <span className="fw-semibold">{item.points.toLocaleString()} pts</span>
                    </li>
                ))}
             </ul>
        </div>
        <div>
            <h3 className="fw-bold fs-5 mb-3">Recent Activity</h3>
            <ul className="list-group">
                {recentActivity.map(activity => (
                    <li key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="mb-0">{activity.action}</p>
                            <p className="text-secondary small mb-0">{activity.time}</p>
                        </div>
                        <span className={`fw-bold ${activity.points.startsWith('+') ? 'text-success' : 'text-danger'}`}>{activity.points}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    );
};

const InteractiveMap = () => {
    const [mapMode, setMapMode] = useState('facilities'); // 'facilities' or 'tracking'
    const [locations, setLocations] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [filters, setFilters] = useState({
        recycling: true,
        scrap: true,
        composting: true,
        hazardous: true,
    });
    
    // Bounding box for Chennai area
    const mapBounds = { minLat: 12.8, maxLat: 13.2, minLon: 80.0, maxLon: 80.3 };

    useEffect(() => {
        // Mock data for facilities with coordinates within Chennai
        const facilityData = [
            { id: 1, name: 'GreenWave Recycling', address: 'Velachery, Chennai', status: 'Open', category: 'recycling', lat: 12.978, lon: 80.221 },
            { id: 2, name: 'Metro Scrap Dealers', address: 'Guindy, Chennai', status: 'Closed', category: 'scrap', lat: 13.010, lon: 80.215 },
            { id: 3, name: 'Adyar Eco Compost', address: 'Adyar, Chennai', status: 'Open', category: 'composting', lat: 13.004, lon: 80.259 },
            { id: 4, name: 'ChemSafe Disposal', address: 'Manali, Chennai', status: 'Open', category: 'hazardous', lat: 13.164, lon: 80.269 },
            { id: 5, name: 'Re-source Center', address: 'Anna Nagar, Chennai', status: 'Open', category: 'recycling', lat: 13.085, lon: 80.210 },
        ];
        setLocations(facilityData);
        
        // Mock data for trucks
        const truckData = [
            { id: 101, name: 'Truck #101', area: 'T. Nagar', status: 'On Route', eta: '15 mins', lat: 13.04, lon: 80.23, category: 'truck' },
            { id: 102, name: 'Truck #205', area: 'Nungambakkam', status: 'Delayed', eta: '45 mins', lat: 13.06, lon: 80.24, category: 'truck' },
            { id: 103, name: 'Truck #330', area: 'Mylapore', status: 'Collection Complete', eta: '-', lat: 13.03, lon: 80.27, category: 'truck' },
        ];
        setTrucks(truckData);
    }, []);

    const handleFilterChange = (filterName) => {
        setFilters(prevFilters => ({ ...prevFilters, [filterName]: !prevFilters[filterName] }));
    };

    const getPosition = (lat, lon) => {
        const top = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
        const left = ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * 100;
        return { top: `${top}%`, left: `${left}%` };
    };

    const filteredLocations = locations.filter(location => filters[location.category]);
    
    const filterOptions = [
        { key: 'recycling', label: 'Recycling', icon: <RecyclingMarker /> },
        { key: 'scrap', label: 'Scrap Shops', icon: <ScrapMarker /> },
        { key: 'composting', label: 'Composting', icon: <CompostMarker /> },
        { key: 'hazardous', label: 'Hazardous', icon: <HazardousMarker /> },
    ];
    
    const InfoModal = ({ location, onClose }) => {
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lon}`;
      const isTruck = location.category === 'truck';
      const MarkerComponent = isTruck ? <TruckMarker /> : filterOptions.find(opt => opt.key === location.category)?.icon;
      
      return (
        <div className="position-absolute bottom-0 start-0 end-0 bg-white p-3 rounded-top-4 shadow-lg" style={{zIndex: 1000, animation: 'slideUp 0.3s ease-out'}}>
          <div className="d-flex justify-content-between align-items-center mb-2">
             <div className="d-flex align-items-center gap-3">
                 {MarkerComponent}
                 <div>
                    <h5 className="fw-bold mb-0">{location.name}</h5>
                     {isTruck ? (
                        <p className={`small fw-bold mb-0 ${location.status === 'Delayed' ? 'text-danger' : 'text-success'}`}>{location.status}</p>
                     ) : (
                        <p className={`small fw-bold mb-0 ${location.status === 'Open' ? 'text-success' : 'text-danger'}`}>{location.status}</p>
                     )}
                 </div>
             </div>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <p className="small text-secondary mb-3">{isTruck ? `Current Area: ${location.area} | ETA: ${location.eta}` : location.address}</p>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success w-100">
            <DirectionsIcon className="me-2"/> {isTruck ? 'Track Live' : 'Get Directions'}
          </a>
        </div>
      );
    };

    return (
        <div className="d-flex flex-column position-relative" style={{ minHeight: '500px', height: '100%' }}>
             <div className="position-absolute top-0 start-50 translate-middle-x p-2" style={{zIndex: 10, width: '95%'}}>
                <div className="btn-group w-100 shadow-sm">
                    <button 
                        className={`btn ${mapMode === 'facilities' ? 'btn-success' : 'btn-light'}`}
                        onClick={() => setMapMode('facilities')}
                    >
                        <PinIcon className="me-2" /> Find Facilities
                    </button>
                    <button 
                        className={`btn ${mapMode === 'tracking' ? 'btn-success' : 'btn-light'}`}
                        onClick={() => setMapMode('tracking')}
                    >
                       <TruckMarker /> Vehicle Tracking
                    </button>
                </div>
             </div>
            
            <div className="flex-grow-1 position-relative rounded-4 overflow-hidden">
                 <iframe 
                    width="100%" 
                    height="100%"
                    frameBorder="0" 
                    scrolling="no" 
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.minLon},${mapBounds.minLat},${mapBounds.maxLon},${mapBounds.maxLat}&layer=mapnik`}
                    style={{ pointerEvents: 'none' }}
                 >
                </iframe>
                
                {mapMode === 'facilities' && filteredLocations.map(location => (
                    <button 
                        key={location.id}
                        className="btn p-0 border-0 position-absolute"
                        style={{...getPosition(location.lat, location.lon), transform: 'translate(-50%, -100%)', zIndex: 5}}
                        onClick={() => setSelectedLocation(location)}
                    >
                         {filterOptions.find(opt => opt.key === location.category)?.icon}
                    </button>
                ))}

                 {mapMode === 'tracking' && trucks.map(truck => (
                    <button 
                        key={truck.id}
                        className="btn p-0 border-0 position-absolute"
                        style={{...getPosition(truck.lat, truck.lon), transform: 'translate(-50%, -50%)', zIndex: 5}}
                        onClick={() => setSelectedLocation(truck)}
                    >
                        <TruckMarker />
                    </button>
                ))}
            </div>
            
            {mapMode === 'facilities' && (
                <div className="position-absolute top-50 end-0 translate-middle-y d-flex flex-column gap-2 bg-white p-2 rounded-start-3 shadow-sm" style={{zIndex: 10}}>
                    {filterOptions.map(opt => (
                        <button key={opt.key} className={`btn btn-sm ${filters[opt.key] ? 'btn-primary' : 'btn-light'}`} onClick={() => handleFilterChange(opt.key)}>
                            {opt.icon}
                        </button>
                    ))}
                </div>
            )}

            {selectedLocation && <InfoModal location={selectedLocation} onClose={() => setSelectedLocation(null)} />}

            {mapMode === 'tracking' && !selectedLocation && (
                 <div className="position-absolute bottom-0 start-0 end-0 bg-white p-3 rounded-top-4 shadow-lg" style={{zIndex: 999, animation: 'slideUp 0.3s ease-out'}}>
                    <h6 className="fw-bold">Active Trucks</h6>
                    <ul className="list-group list-group-flush">
                        {trucks.map(truck => (
                            <li key={truck.id} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => setSelectedLocation(truck)}>
                                <div>
                                    <p className="mb-0 fw-semibold">{truck.name}</p>
                                    <p className="small text-secondary mb-0">{truck.area}</p>
                                </div>
                                <span className={`badge ${truck.status === 'Delayed' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-success-subtle text-success-emphasis'}`}>{truck.status}</span>
                            </li>
                        ))}
                    </ul>
                 </div>
            )}
        </div>
    );
};

const AIClassification = ({ addRecycledItems }) => {
    // Scan state
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Request State
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [requestDetails, setRequestDetails] = useState(null);

    // Report state
    const [scanMode, setScanMode] = useState('scan'); // 'scan' or 'report'
    const [reportIssueType, setReportIssueType] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [reportImage, setReportImage] = useState(null);
    const reportFileInputRef = useRef(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsLoading(true);
            setResult(null);
            setImage(URL.createObjectURL(file));
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await axios.post("http://localhost:5000/detect", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setResult(response.data);
                const detections = response.data.detections || [];
                if (detections.length > 0) {
                    addRecycledItems(detections.length);
                }
            } catch (error) {
                alert("Error: " + (error.response?.data?.error || error.message));
            }
            setIsLoading(false);
        }
    };

    const handleAuthorityRequest = (severity, detections) => {
        const labels = detections.map(d => d.label);
        const uniqLabels = [...new Set(labels)].join(", ");
        const simulatedGeotag = "Lat: 13.0827° N, Lon: 80.2707° E (Chennai)";
        const refNum = "REF-" + Math.random().toString(36).substring(2, 7).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
        
        setRequestDetails({
            refNum,
            severity,
            uniqLabels: uniqLabels || "General waste",
            geotag: simulatedGeotag
        });
        setRequestSubmitted(true);
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };
    
    const handleReportImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReportImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const triggerReportFileSelect = () => {
        reportFileInputRef.current.click();
    };

    const handleReportSubmit = () => {
        if (!reportIssueType || !reportDescription) {
            alert('Please select an issue type and provide a description.');
            return;
        }
        alert(`Report Submitted Successfully!\nType: ${reportIssueType}\nDescription: ${reportDescription}\n\nThank you for helping keep our community clean. Your report has been sent to the nearest authorities, who will use the provided geotag to address the issue.`);
        setReportIssueType('');
        setReportDescription('');
        setReportImage(null);
    };

    return (
     <div className="d-flex flex-column gap-4 position-relative">
        <h1 className="fs-2 fw-bold text-center">Community Action</h1>
        
        <div className="btn-group w-100" role="group">
            <button type="button" className={`btn ${scanMode === 'scan' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setScanMode('scan')}>
                <CameraIcon className="me-2"/> Scan & Classify
            </button>
            <button type="button" className={`btn ${scanMode === 'report' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setScanMode('report')}>
                <FlagIcon className="me-2"/> Report Issue
            </button>
        </div>

        {scanMode === 'scan' ? (
            <>
                <input 
                    type="file" 
                    accept="image/*" 
                    className="d-none" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                 />

                {isLoading && (
                    <div className="d-flex justify-content-center p-5">
                        <div className="spinner-border text-success" role="status" style={{width: '3rem', height: '3rem'}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {!result && !isLoading && (
                    <>
                        <div className="bg-body-tertiary rounded-4 p-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '350px' }} onClick={triggerFileSelect}>
                            {image ? (
                                 <img src={image} alt="Uploaded waste" className="img-fluid rounded-3" style={{ maxHeight: '300px', objectFit: 'cover' }}/>
                            ) : (
                                 <div className="text-center text-secondary">
                                    <div className="p-4 bg-white rounded-circle d-inline-block shadow-sm">
                                       <CameraIcon style={{width: '40px', height: '40px'}}/>
                                    </div>
                                    <p className="mt-3">Tap to upload an image</p>
                                 </div>
                            )}
                        </div>
                         <button className="btn btn-primary btn-lg w-100 py-3 fw-semibold" onClick={triggerFileSelect}>
                            Upload from Gallery
                        </button>
                    </>
                )}

                {result && !isLoading && (() => {
                     const densityCount = (result.detections || []).length;
                     let severity = "Low";
                     let severityClass = "bg-success-subtle text-success-emphasis";
                     if (densityCount >= 6) {
                         severity = "High (Critical)";
                         severityClass = "bg-danger-subtle text-danger-emphasis";
                     } else if (densityCount >= 3) {
                         severity = "Moderate";
                         severityClass = "bg-warning-subtle text-warning-emphasis";
                     }

                     return (
                         <div className="d-flex flex-column gap-3">
                              <h2 className="fs-5 fw-bold">Detection Result</h2>
                              <p className="text-secondary small mt-n3">Detected objects in your image:</p>
                              {result.image_base64 && (
                                 <img src={`data:image/png;base64,${result.image_base64}`} alt="Detected" className="img-fluid rounded-3" style={{ maxHeight: '280px', objectFit: 'cover' }}/>
                              )}

                              {/* Density Level Card */}
                              {densityCount > 0 && (
                                  <div className="card border-0 bg-light p-3 rounded-4 mb-1">
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                          <span className="fw-bold small text-uppercase text-secondary" style={{ fontSize: '0.75rem' }}>Garbage Density</span>
                                          <span className={`badge ${severityClass} px-2 py-1 rounded-pill`} style={{ fontSize: '0.8rem' }}>{severity}</span>
                                      </div>
                                      <p className="small text-secondary mb-0">
                                          AI identified <strong>{densityCount}</strong> waste item(s) here.
                                      </p>
                                  </div>
                              )}

                              {result.detections && result.detections.length > 0 ? (
                                  <div className="alert alert-success py-2 px-3 small rounded-3 mb-1">
                                      🎉 Eco Action rewarded: <strong>+{result.detections.length * 10} pts</strong> and <strong>+{result.detections.length} recycled items</strong> added!
                                  </div>
                              ) : (
                                  <div className="alert alert-warning py-2 px-3 small rounded-3 mb-1">
                                      No waste items detected. Try another photo!
                                  </div>
                              )}

                              {/* Direct Dispatch Button */}
                              {densityCount > 0 && (
                                  <button 
                                      className="btn btn-danger btn-lg w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm mb-1"
                                      onClick={() => handleAuthorityRequest(severity, result.detections)}
                                      style={{ fontSize: '0.95rem' }}
                                  >
                                      <FlagIcon style={{ width: '18px', height: '18px' }} /> Request Cleanup from Authority
                                  </button>
                              )}

                              <ul className="list-group">
                                 {result.detections.map((det, idx) => (
                                     <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                         <span>{det.label}</span>
                                         <span className="badge bg-success">{(det.confidence * 100).toFixed(2)}%</span>
                                     </li>
                                 ))}
                              </ul>
                             <button className="btn btn-secondary mt-2" onClick={() => { setImage(null); setResult(null); }}>Scan Another Item</button>
                         </div>
                     );
                })()}

                {/* Request Success Overlay */}
                {requestSubmitted && requestDetails && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-white d-flex align-items-center justify-content-center p-4 shadow-lg rounded-4" style={{ zIndex: 1050 }}>
                        <div className="text-center">
                            <div className="text-danger fs-1 mb-3">✅</div>
                            <h4 className="fw-bold">Cleanup Requested</h4>
                            <p className="text-secondary small">Your request has been dispatched to the local municipal team.</p>
                            <div className="bg-light p-3 rounded-3 text-start font-monospace small mb-4">
                                <div><strong>ID:</strong> {requestDetails.refNum}</div>
                                <div><strong>Level:</strong> {requestDetails.severity}</div>
                                <div><strong>Items:</strong> {requestDetails.uniqLabels}</div>
                                <div><strong>Loc:</strong> {requestDetails.geotag}</div>
                            </div>
                            <button className="btn btn-primary w-100" onClick={() => { setRequestSubmitted(false); setRequestDetails(null); setImage(null); setResult(null); }}>Done</button>
                        </div>
                    </div>
                )}
            </>
        ) : (
             <div className="d-flex flex-column gap-3">
                <p className="text-secondary small">Help us keep our community clean. Your report will be sent to the nearest authorities with a geotag of the location.</p>
                <select className="form-select p-3" value={reportIssueType} onChange={e => setReportIssueType(e.target.value)}>
                    <option value="">Select issue type...</option>
                    <option value="littering">Public Littering</option>
                    <option value="overflowing-bin">Overflowing Public Bin</option>
                    <option value="illegal-dumping">Illegal Waste Dumping</option>
                    <option value="uncleaned-area">Garbage Not Cleaned for Days</option>
                    <option value="other">Other</option>
                </select>
                <textarea
                    className="form-control p-3"
                    rows="4"
                    placeholder="Please provide a detailed description of the issue..."
                    value={reportDescription}
                    onChange={e => setReportDescription(e.target.value)}
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    className="d-none" 
                    ref={reportFileInputRef}
                    onChange={handleReportImageUpload}
                 />
                <div className="bg-body-tertiary rounded-4 p-3 text-center" onClick={triggerReportFileSelect}>
                    {reportImage ? (
                        <img src={reportImage} alt="Report attachment" className="img-fluid rounded-3" style={{ maxHeight: '150px', objectFit: 'cover' }}/>
                    ) : (
                        <div className="text-secondary">
                            <CameraIcon />
                            <p className="small mb-0 mt-2">Attach a Photo (Optional)</p>
                        </div>
                    )}
                </div>
                <button className="btn btn-danger btn-lg w-100 py-3 fw-semibold" onClick={handleReportSubmit}>
                    Submit Report
                </button>
             </div>
        )}
    </div>
    );
};

const Marketplace = ({ userProfile, deductPoints }) => {
    const products = [
        {
            id: 1,
            title: "Bamboo Travel Mug",
            desc: "Double-walled organic bamboo mug with stainless steel interior.",
            imageUrl: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=600",
            points: 1500
        },
        {
            id: 2,
            title: "Organic Cotton Tote",
            desc: "Heavy-duty, 100% organic cotton reusable grocery bag.",
            imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
            points: 800
        },
        {
            id: 3,
            title: "Smart Composting Bin",
            desc: "Odor-free, compact countertop organic waste composter.",
            imageUrl: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
            points: 8000
        },
        {
            id: 4,
            title: "Stainless Straw Set",
            desc: "Set of 4 metal straws with cleaning brush and carrying pouch.",
            imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600",
            points: 500
        },
        {
            id: 5,
            title: "Metro Transit Pass",
            desc: "1-Month local metro/bus pass to promote public transit.",
            imageUrl: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=600",
            points: 5000
        },
        {
            id: 6,
            title: "Zero Waste Soap Bar",
            desc: "All-natural, package-free body soap made with essential oils.",
            imageUrl: "https://images.unsplash.com/photo-1607006342411-92f1f83427ec?auto=format&fit=crop&q=80&w=600",
            points: 600
        }
    ];

    const [redeemedItem, setRedeemedItem] = useState(null);
    const [voucherCode, setVoucherCode] = useState("");

    const handleRedeem = (product) => {
        if (userProfile.points < product.points) {
            alert(`Insufficient points! You need ${product.points} points for this item. You currently have ${userProfile.points} points.`);
            return;
        }

        const success = deductPoints(product.points);
        if (success) {
            const code = "ECO-" + Math.random().toString(36).substring(2, 7).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
            setVoucherCode(code);
            setRedeemedItem(product);
        } else {
            alert("Redemption failed. Please try again.");
        }
    };

    return (
        <div className="d-flex flex-column gap-4 position-relative h-100">
            <div className="d-flex justify-content-between align-items-center mb-0">
                <h1 className="fs-2 fw-bold mb-0">Eco Shop</h1>
                <span className="badge bg-success-subtle text-success-emphasis p-2 fs-6">
                    {userProfile.points.toLocaleString()} pts
                </span>
            </div>
            
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Search for rewards..." />
                <button className="btn btn-outline-secondary" type="button">Search</button>
            </div>
            
            <div className="row g-3">
                {products.map(product => (
                    <div key={product.id} className="col-6 col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                            <img src={product.imageUrl} className="card-img-top" alt={product.title} style={{ height: '120px', objectFit: 'cover' }} />
                            <div className="card-body d-flex flex-column p-2 p-md-3">
                                <h5 className="card-title fs-6 fw-bold mb-1">{product.title}</h5>
                                <p className="text-secondary small mb-2" style={{ fontSize: '0.75rem', height: '32px', overflow: 'hidden', lineHeight: '1.3' }}>{product.desc}</p>
                                <p className="card-text text-success fw-bold small mb-2">{product.points.toLocaleString()} pts</p>
                                <button 
                                    className="btn btn-sm btn-success mt-auto w-100 py-1"
                                    onClick={() => handleRedeem(product)}
                                >
                                    Redeem
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Redeemed Success Modal Overlay */}
            {redeemedItem && (
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3" 
                    style={{ zIndex: 1050, left: 0, right: 0 }}
                >
                    <div className="bg-white rounded-4 p-4 text-center shadow-lg w-100" style={{ maxWidth: '320px' }}>
                        <div className="text-success fs-1 mb-2">🎉</div>
                        <h4 className="fw-bold mb-2">Redeemed!</h4>
                        <p className="small text-secondary mb-3">You claimed <strong>{redeemedItem.title}</strong>.</p>
                        <div className="bg-light p-3 rounded-3 mb-3 border border-dashed border-success">
                            <span className="text-secondary small d-block">Voucher Code</span>
                            <strong className="fs-5 text-success font-monospace">{voucherCode}</strong>
                        </div>
                        <button className="btn btn-success w-100" onClick={() => setRedeemedItem(null)}>
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const LearningModules = ({ addPoints }) => {
    const [selectedModule, setSelectedModule] = useState(null);

    const modules = [
        { id: 1, title: "The Importance of Composting", duration: "15 min", category: "Basics", points: 50, questions: [
            { q: "What is composting?", o: ["A type of recycling", "Controlled decomposition of organic matter", "A way to burn trash"], a: 1 },
            { q: "Which item cannot be composted?", o: ["Fruit peels", "Plastic bags", "Coffee grounds"], a: 1 },
        ]},
        { id: 2, title: "Advanced Sorting Techniques", duration: "30 min", category: "Skills", points: 100, questions: [
             { q: "Which plastic number is commonly recycled?", o: ["#1 PET", "#3 PVC", "#6 PS"], a: 0 },
        ]},
        { id: 3, title: "Safety Protocols for Waste Handling", duration: "45 min", category: "Safety", points: 150, questions: [] },
        { id: 4, title: "Understanding Recyclable Materials", duration: "25 min", category: "Basics", points: 75, questions: [] },
    ];
    
    if (selectedModule) {
        return <Quiz module={selectedModule} onComplete={() => setSelectedModule(null)} addPoints={addPoints} />;
    }

    return (
        <div className="d-flex flex-column gap-4">
            <h1 className="fs-2 fw-bold text-center">Training Modules</h1>
            <div className="d-flex flex-column gap-3">
                {modules.map(module => (
                    <div key={module.id} className="p-3 bg-body-tertiary rounded-4 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setSelectedModule(module)}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span className={`badge bg-primary-subtle text-primary-emphasis mb-2`}>{module.category}</span>
                                <h2 className="fw-bold fs-6 mb-1">{module.title}</h2>
                                <p className="text-secondary small mb-0">{module.duration}</p>
                            </div>
                            <div className="text-primary">
                                <ArrowRightCircleIcon />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Quiz = ({ module, onComplete, addPoints }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (isCompleted) {
            addPoints(module.points);
        }
    }, [isCompleted]);

    if (module.questions.length === 0) {
        return (
            <div className="text-center d-flex flex-column gap-3">
                 <h2 className="fs-4 fw-bold">{module.title}</h2>
                 <p>This module does not have a quiz yet. Please check back later.</p>
                 <button className="btn btn-secondary" onClick={onComplete}>Back to Modules</button>
            </div>
        )
    }

    const currentQuestion = module.questions[currentQuestionIndex];
    const score = Object.keys(selectedAnswers).reduce((acc, key) => {
        const question = module.questions[parseInt(key)];
        return question.a === selectedAnswers[key] ? acc + 1 : acc;
    }, 0);

    const handleAnswerSelect = (optionIndex) => {
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: optionIndex });
    };

    const handleNext = () => {
        if (currentQuestionIndex < module.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsCompleted(true);
        }
    };
    
    if (isCompleted) {
        return (
            <div className="text-center d-flex flex-column gap-3">
                 <h2 className="fs-4 fw-bold">Quiz Completed!</h2>
                 <p>You scored {score} out of {module.questions.length}.</p>
                 <div className="text-center my-3 p-3 bg-success text-white rounded-4">
                    <p className="fw-bold fs-5 mb-0">+{module.points} Points Earned!</p>
                </div>
                 <button className="btn btn-success" onClick={onComplete}>Back to Modules</button>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column gap-4">
            <h2 className="fs-4 fw-bold text-center">{module.title}</h2>
            <div className="bg-body-tertiary p-4 rounded-4">
                <p className="fw-semibold">{currentQuestionIndex + 1}. {currentQuestion.q}</p>
                <div className="d-flex flex-column gap-2">
                    {currentQuestion.o.map((option, index) => (
                        <button 
                            key={index} 
                            className={`btn text-start ${selectedAnswers[currentQuestionIndex] === index ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => handleAnswerSelect(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <button 
                className="btn btn-primary" 
                onClick={handleNext} 
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
            >
                {currentQuestionIndex < module.questions.length - 1 ? 'Next' : 'Submit'}
            </button>
        </div>
    )
}


const Profile = ({ setView, userProfile, onEdit }) => {
    const userStats = {
        itemsRecycled: userProfile.recycledCount,
        pointsEarned: userProfile.points,
        rank: userProfile.rank
    };

    const handleLogout = () => {
        setView('login');
    };

    return (
        <div className="d-flex flex-column gap-4 mx-auto" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="d-flex flex-column align-items-center bg-body-tertiary p-4 rounded-4">
                <div className="p-1 rounded-circle bg-secondary-subtle mb-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px'}}>
                    {userProfile.profilePic ? (
                        <img src={userProfile.profilePic} alt="Profile" className="rounded-circle w-100 h-100" style={{objectFit: 'cover'}}/>
                    ) : (
                        <UserIcon style={{width: '50px', height: '50px'}} className="text-secondary"/>
                    )}
                </div>
                <h2 className="fw-bold fs-4 mb-1">{userProfile.name}</h2>
                <p className="text-success mb-3">Eco Guardian</p>
            </div>

            <div className="d-flex justify-content-around text-center p-3 bg-body-tertiary rounded-4">
                <div>
                    <p className="fw-bold fs-4 mb-0">{userStats.itemsRecycled}</p>
                    <p className="text-secondary small mb-0">Items Recycled</p>
                </div>
                <div>
                    <p className="fw-bold fs-4 mb-0">{userStats.pointsEarned.toLocaleString()}</p>
                    <p className="text-secondary small mb-0">Points Earned</p>
                </div>
                <div>
                    <p className="fw-bold fs-4 mb-0">#{userStats.rank}</p>
                    <p className="text-secondary small mb-0">Global Rank</p>
                </div>
            </div>
            
             <button className="btn btn-success w-100 py-2 fw-semibold" onClick={onEdit}>Edit Profile</button>
             <button className="btn btn-outline-danger w-100 py-2 fw-semibold" onClick={handleLogout}>Log Out</button>
        </div>
    );
};


// --- Navigation Component ---

const BottomNav = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { name: 'Home', icon: <HomeIcon /> },
    { name: 'Map', icon: <MapIcon /> },
    { name: 'Scan', icon: <ScanIcon /> },
    { name: 'Shop', icon: <ShopUiIcon /> },
    { name: 'Learn', icon: <LearnIcon />},
    { name: 'Profile', icon: <ProfileIcon /> },
  ];

  return (
    <div className="bg-white border-top">
      <div className="d-flex justify-content-around">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentPage(item.name)}
            className={`btn d-flex flex-column align-items-center justify-content-center w-100 pt-2 pb-1 border-0 ${
              currentPage === item.name ? 'text-success' : 'text-secondary'
            }`}
          >
            {item.icon}
            <span style={{ fontSize: '0.75rem' }}>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

