import React, { useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { auth, db } from '../../Config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify' // Add this import for toast
import { useContext } from 'react'
import { AppContext } from '../../Context/AppContext'



function ProfileUpdate() {
    const navigate = useNavigate()
    const {loadUserData} = useContext(AppContext)

    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [uid, setUid] = useState('')
    const [prevImage, setPrevImage] = useState('')

    const handleImageChange = async (e) => {
        setImage(e.target.files[0])

    }

    const profileUpdate = async (e) => {
        e.preventDefault()

        try {
            if (!image && !prevImage) {
                toast.error('Please select an image')
                return
            }

            const docRef = doc(db, "users", uid)
            if (image) {
                const imgUrl = await uploadImageAndGetURL(image)
                setPrevImage(imgUrl)

                await updateDoc(docRef, {
                    avatar: imgUrl,
                    bio: bio,
                    name: name
                })
            }

            else {
                await updateDoc(docRef, {
                    avatar: prevImage,
                    bio: bio,
                    name: name
                })
            }
            const snap=await getDoc(docRef)
            loadUserData(snap.data())
            navigate('/chat')
        }
        catch (error) {
            toast.error('Error updating profile: ' + error.message)
            console.error('Error updating profile:', error)
        }
    }

    // This function would handle image upload to storage and return the URL
    const uploadImageAndGetURL = async (imageFile) => {
        setLoading(true)
        const data = new FormData()
        data.append('file', imageFile)
        data.append('upload_preset', 'chattex_profile_img_upload')
        data.append('cloud_name', 'dhn668r0r')

        const res = await fetch('https://api.cloudinary.com/v1_1/dhn668r0r/image/upload', {
            method: 'POST',
            body: data
        })

        const uploadedImageUrl = await res.json()
        console.log(uploadedImageUrl)
        setLoading(false)
        return uploadedImageUrl.url
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid)
                const docRef = doc(db, "users", user.uid)
                const docSnap = await getDoc(docRef)


                const userData = docSnap.data()

                if (userData.name) {
                    setName(userData.name)
                }

                if (userData.bio) {
                    setBio(userData.bio)
                }

                if (userData.avatar) {
                    setPrevImage(userData.avatar)
                }

            }
            else {
                navigate('/')
            }
        })
    }, [navigate])

    return (
        <div className='profile'>
            <div className="profile-container">
                <form onSubmit={profileUpdate}>
                    <h3>Profile Details</h3>
                    <label htmlFor='avatar'>
                        <input
                            onChange={handleImageChange}
                            type='file'
                            id='avatar'
                            accept='.png, .jpg, .jpeg'
                            hidden
                        />
                        <img
                            src={image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon}
                            alt='Profile avatar'
                        />
                        Upload Profile Image
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type='text'
                        placeholder='Your Name'
                        required
                    />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder='Write Profile Bio'
                        required
                    ></textarea>
                    <button type='submit'>Update Profile</button>
                </form>
                <img
                    className="profile-pic"
                    src={image ? URL.createObjectURL(image) : prevImage || assets.logo_icon}
                    alt='Profile preview'
                />
            </div>
        </div>
    )
}

export default ProfileUpdate
