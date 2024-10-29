// סכמה ליצירת משתמש חדש
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../utils/types'

//  הגדרת הסכמה לשדות המשתמש
const userSchema: Schema = new Schema({
  firstName: { type: String, required: true, minlength: 2 },                               // שם פרטי, נדרש
  lastName: { type: String, required: true, minlength: 2 },                               // שם משפחה, נדרש
  email: { type: String, required: true, unique: true },                                 // אימייל, ייחודי ונדרש
  phone: { type: String, required: true, unique: true },                                // מספר טלפון, ייחודי ונדרש  
  password: { type: String, required: true, minlength: 8, match: /^\$2b\$10\$.+/ },    // סיסמה ייחודי ונדרש מוגבל לספרות ואותיות לועזיות
  workSpaceList: { type: [String] },                                                  // חיבור ל workspaces
  icon: { type: String, default: "" }                                                             // הוספת אייקון
}, {
  timestamps: true                                                                  // מוסיף שדות לתארוך זמן יצירת היוזר, ולזמן עדכון היוזר
});

// יצירת המודל עבור הקולקציה "users"
const User = mongoose.model<IUser>('user', userSchema);

export default User;