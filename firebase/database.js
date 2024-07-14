//database.js
import { addDoc, collection, getDoc, doc,setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebase/authantication";

export const addToFavorites = async (userId,id,type,img,title) => {
    try {
      const userDocRef = doc(FIREBASE_DB, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || [];
        favorites.push({ id: id, type:type,img:img,title:title });

        await setDoc(userDocRef, { favorites }, { merge: true });

        console.log("Öge favorilere eklendi.");
      } else {
        console.error("Kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("Favorilere eklerken hata oluştu:", error);
    }
  };

  export const removeFromFavorites = async (userId, movieId) => {
    try {
      const userDocRef = doc(FIREBASE_DB, "users", userId);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || [];
        const updatedFavorites = favorites.filter(favorite => favorite.id !== movieId);
  
        await setDoc(userDocRef, { favorites: updatedFavorites }, { merge: true });
  
        console.log("Öge favorilerden kaldırıldı.");
      } else {
        console.error("Kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("Favorilere eklerken hata oluştu:", error);
    }
  };


   