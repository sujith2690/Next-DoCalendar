import * as Yup from 'yup';

export const profileSchema = Yup.object({
    userName: Yup.string()
        .min(1, "Name must be at least 1 character")
        .max(25, "Name must be at most 25 characters")
        .required("Please enter your Name"),

    email: Yup.string() 
        .email("Invalid email format")
        .required("Please enter your Email"),

    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Please enter your Phone number"),
});
