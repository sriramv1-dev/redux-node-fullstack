import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../reducers/usersSlice";
import "./AddUserForm.css";
import { setNestedValue } from "../../utils/formUtils";

const initialForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: "",
    },
  },
  company: {
    name: "",
    catchPhrase: "",
    bs: "",
  },
};
const AddUserForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const addStatus = useSelector((state) => state.ur.addUserStatus); // Assuming 'ur' is your users reducer key
  const addError = useSelector((state) => state.ur.addUserError);

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showCompany, setShowCompany] = useState(false);

  // Effect to show success message temporarily
  useEffect(() => {
    if (addStatus === "succeeded") {
      setShowSuccess(true);
      setFormData(initialForm);
      setFormErrors({});
    }

    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [addStatus]);

  const handleChange = ({ target: { name, value } }) => {
    const updated = name.includes(".")
      ? setNestedValue(formData, name, value)
      : { ...formData, [name]: value };
    setFormData(updated);
    setFormErrors((e) => ({ ...e, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const required = ["name", "username", "email"];
    required.forEach((field) => {
      if (!formData[field].trim()) errors[field] = `${field} is required`;
    });
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Invalid email";

    if (showAddress) {
      ["street", "suite", "city", "zipcode"].forEach((f) => {
        if (!formData.address[f].trim())
          errors[`address.${f}`] = `${f} is required`;
      });
      ["lat", "lng"].forEach((g) => {
        if (!formData.address.geo[g].trim())
          errors[`address.geo.${g}`] = `${g} is required`;
      });
    }

    if (showCompany) {
      ["name", "catchPhrase", "bs"].forEach((c) => {
        if (!formData.company[c].trim())
          errors[`company.${c}`] = `${c} is required`;
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.website && { website: formData.website }),
      ...(showAddress && { address: formData.address }),
      ...(showCompany && { company: formData.company }),
    };

    dispatch(addUser(payload));
  };

  const renderInput = (name, label, isRequired = false, placeholder = "") => {
    const val =
      name.split(".").reduce((obj, key) => obj?.[key], formData) || "";
    return (
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          {label} {isRequired && <span className="required-star">*</span>}
        </label>
        <input
          name={name}
          value={val}
          onChange={handleChange}
          className={`form-input ${formErrors[name] ? "error" : ""}`}
          placeholder={placeholder}
        />
        {formErrors[name] && (
          <p className="error-message">{formErrors[name]}</p>
        )}
      </div>
    );
  };

  const renderPersonalInformation = () => {
    return (
      <div className="form-section personal-info">
        <h3 className="section-title">Personal Information</h3>
        <div className="grid-layout">
          {renderInput("name", "Name", true)}
          {renderInput("username", "Username", true)}
          {renderInput("email", "Email", true)}
          {renderInput("phone", "Phone")}
          {renderInput("website", "Website")}
        </div>
      </div>
    );
  };

  const renderAddressInfo = () => {
    return (
      <div className="form-section address-info">
        <button
          type="button"
          onClick={() => setShowAddress(!showAddress)}
          className="toggle-button"
        >
          <span>Address Information</span>
          <span className="toggle-button-text">
            {showAddress ? "Hide" : "Show"}
          </span>
        </button>
        {showAddress && (
          <div
            className="grid-layout transition-all"
            style={{ marginTop: "15px" }}
          >
            {renderInput("address.street", "Street", true)}
            {renderInput("address.suite", "Suite", true)}
            {renderInput("address.city", "City", true)}
            {renderInput("address.zipcode", "Zipcode", true)}
            {renderInput("address.geo.lat", "Latitude", true)}
            {renderInput("address.geo.lng", "Longitude", true)}
          </div>
        )}
      </div>
    );
  };

  const renderCompanyInfo = () => {
    return (
      <div className="form-section company-info">
        <button
          type="button"
          onClick={() => setShowCompany(!showCompany)}
          className="toggle-button"
        >
          <span>Company Information</span>
          <span className="toggle-button-text">
            {showCompany ? "Hide" : "Show"}
          </span>
        </button>
        {showCompany && (
          <div
            className="grid-layout transition-all"
            style={{ marginTop: "15px" }}
          >
            {renderInput("company.name", "Company Name", true)}
            {renderInput("company.catchPhrase", "Catch Phrase", true)}
            {renderInput("company.bs", "BS", true)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="form-card">
        <button
          onClick={closeModal}
          className="modal-close-button"
          aria-label="Close form"
        >
          ✖
        </button>
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit} className="form-layout">
          {renderPersonalInformation()}
          {renderAddressInfo()}
          {renderCompanyInfo()}

          <div className="form-section company-info">
            <button
              type="button"
              onClick={() => setShowCompany(!showCompany)}
              className="toggle-button"
            >
              <span>Company Information</span>
              <span className="toggle-button-text">
                {showCompany ? "Hide" : "Show"}
              </span>
            </button>
            {showCompany && (
              <div
                className="grid-layout transition-all"
                style={{ marginTop: "15px" }}
              >
                {renderInput("company.name", "Company Name", true)}
                {renderInput("company.catchPhrase", "Catch Phrase", true)}
                {renderInput("company.bs", "BS", true)}
              </div>
            )}
          </div>

          <div className="submit-section">
            <button type="submit" disabled={addStatus === "loading"}>
              {addStatus === "loading" ? "Adding..." : "Add User"}
            </button>

            {showSuccess && (
              <div className="success-message">User added successfully!</div>
            )}
            {addError && <div className="error-alert">Error: {addError}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
