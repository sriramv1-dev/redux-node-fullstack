import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../reducers/usersSlice";
import "./AddUserForm.css";

const initialFormState = {
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
  const addStatus = useSelector((state) => state.ur.addUsersStatus); // Assuming 'ur' is your users reducer key
  const addError = useSelector((state) => state.ur.addUsersError);

  const [formData, setFormData] = useState(initialFormState);
  const [showAddress, setShowAddress] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Effect to show success message temporarily
  useEffect(() => {
    if (addStatus === "succeeded") {
      setShowSuccessMessage(true);
      setFormData(initialFormState); // Reset form on success
      setFormErrors({}); // Clear any previous form errors
      // Hide success message after 3 seconds
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [addStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested fields by splitting the name (e.g., 'address.street')
    if (name.includes(".")) {
      const parts = name.split(".");
      setFormData((prevData) => {
        let newData = { ...prevData };
        let current = newData;
        // Traverse the object to update the nested property
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = { ...current[parts[i]] }; // Create a new object for immutability
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newData;
      });
    } else {
      // Handle top-level fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    // Clear error for the field being typed into
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    // Top-level required fields
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Invalid email format";

    // Address fields (if address section is shown)
    if (showAddress) {
      if (!formData.address.street.trim())
        errors["address.street"] = "Street is required";
      if (!formData.address.suite.trim())
        errors["address.suite"] = "Suite is required";
      if (!formData.address.city.trim())
        errors["address.city"] = "City is required";
      if (!formData.address.zipcode.trim())
        errors["address.zipcode"] = "Zipcode is required";
      if (!formData.address.geo.lat.trim())
        errors["address.geo.lat"] = "Latitude is required";
      if (!formData.address.geo.lng.trim())
        errors["address.geo.lng"] = "Longitude is required";
    }

    // Company fields (if company section is shown)
    if (showCompany) {
      if (!formData.company.name.trim())
        errors["company.name"] = "Company Name is required";
      if (!formData.company.catchPhrase.trim())
        errors["company.catchPhrase"] = "Catch Phrase is required";
      if (!formData.company.bs.trim()) errors["company.bs"] = "BS is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop if client-side validation fails
    }

    // Construct the user object to send
    const userToSend = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      // Only include phone and website if they are not empty
      ...(formData.phone.trim() && { phone: formData.phone.trim() }),
      ...(formData.website.trim() && { website: formData.website.trim() }),
    };

    // Conditionally add address if section is shown and any address field is filled
    if (
      showAddress &&
      (formData.address.street.trim() ||
        formData.address.suite.trim() ||
        formData.address.city.trim() ||
        formData.address.zipcode.trim() ||
        formData.address.geo.lat.trim() ||
        formData.address.geo.lng.trim())
    ) {
      userToSend.address = {
        street: formData.address.street,
        suite: formData.address.suite,
        city: formData.address.city,
        zipcode: formData.address.zipcode,
        geo: {
          lat: formData.address.geo.lat,
          lng: formData.address.geo.lng,
        },
      };
    }

    // Conditionally add company if section is shown and any company field is filled
    if (
      showCompany &&
      (formData.company.name.trim() ||
        formData.company.catchPhrase.trim() ||
        formData.company.bs.trim())
    ) {
      userToSend.company = {
        name: formData.company.name,
        catchPhrase: formData.company.catchPhrase,
        bs: formData.company.bs,
      };
    }

    // Dispatch the 'addUser' thunk
    dispatch(addUser(userToSend));
  };

  const renderField = ({
    label,
    type = "text",
    name,
    placeholder,
    isRequired = false,
    className = "form-group",
  }) => {
    return (
      <div className={className}>
        <label htmlFor="name" className="form-label">
          {label} {isRequired && <span className="required-star">*</span>}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
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

  const renderPersonalInformationSection = () => {
    return (
      <div className="form-section personal-info">
        <h3 className="section-title">Personal Information</h3>
        <div className="grid-layout">
          {/* Name */}
          {renderField({
            label: "Name",
            type: "text",
            name: "name",
            placeholder: "Enter full name",
            isRequired: true,
          })}

          {/* Username */}
          {renderField({
            label: "Username",
            type: "text",
            name: "username",
            placeholder: "Choose a unique username",
            isRequired: true,
          })}

          {/* Email */}
          {renderField({
            label: "Email",
            type: "email",
            name: "email",
            placeholder: "Enter email address",
            isRequired: true,
          })}

          {/* Phone */}
          {renderField({
            label: "Phone",
            type: "text",
            name: "phone",
            placeholder: "e.g., 1-770-736-8031 x56442",
            isRequired: false,
          })}

          {/* Website */}
          {renderField({
            label: "Website",
            type: "text",
            name: "website",
            placeholder: "e.g., hildegard.org",
            isRequired: false,
            className: "form-group md-col-span-2",
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="form-card">
        <button
          type="button"
          onClick={closeModal}
          className="modal-close-button"
          aria-label="Close form"
        >
          <span className="sr-only">✖</span>
        </button>
        <h2 className="form-title">Add New User</h2>
        <form onSubmit={handleSubmit} className="form-layout">
          {/* Personal Information Section */}
          {renderPersonalInformationSection()}

          {/* Address Information (Toggleable) */}
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
                {renderField({
                  label: "Street",
                  type: "text",
                  name: "address.street",
                  placeholder: "e.g., Kulas Light",
                  isRequired: true,
                })}
                <div className="form-group">
                  <label htmlFor="address.suite" className="form-label">
                    Suite <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="address.suite"
                    name="address.suite"
                    value={formData.address.suite}
                    onChange={handleChange}
                    className={`form-input ${
                      formErrors["address.suite"] ? "error" : ""
                    }`}
                    placeholder="e.g., Apt. 556"
                  />
                  {formErrors["address.suite"] && (
                    <p className="error-message">
                      {formErrors["address.suite"]}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="address.city" className="form-label">
                    City <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className={`form-input ${
                      formErrors["address.city"] ? "error" : ""
                    }`}
                    placeholder="e.g., Gwenborough"
                  />
                  {formErrors["address.city"] && (
                    <p className="error-message">
                      {formErrors["address.city"]}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="address.zipcode" className="form-label">
                    Zipcode <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="address.zipcode"
                    name="address.zipcode"
                    value={formData.address.zipcode}
                    onChange={handleChange}
                    className={`form-input ${
                      formErrors["address.zipcode"] ? "error" : ""
                    }`}
                    placeholder="e.g., 92998-3874"
                  />
                  {formErrors["address.zipcode"] && (
                    <p className="error-message">
                      {formErrors["address.zipcode"]}
                    </p>
                  )}
                </div>
                <div className="grid-layout md-col-span-2">
                  <div className="form-group">
                    <label htmlFor="address.geo.lat" className="form-label">
                      Latitude <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.geo.lat"
                      name="address.geo.lat"
                      value={formData.address.geo.lat}
                      onChange={handleChange}
                      className={`form-input ${
                        formErrors["address.geo.lat"] ? "error" : ""
                      }`}
                      placeholder="e.g., -37.3159"
                    />
                    {formErrors["address.geo.lat"] && (
                      <p className="error-message">
                        {formErrors["address.geo.lat"]}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="address.geo.lng" className="form-label">
                      Longitude <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.geo.lng"
                      name="address.geo.lng"
                      value={formData.address.geo.lng}
                      onChange={handleChange}
                      className={`form-input ${
                        formErrors["address.geo.lng"] ? "error" : ""
                      }`}
                      placeholder="e.g., 81.1496"
                    />
                    {formErrors["address.geo.lng"] && (
                      <p className="error-message">
                        {formErrors["address.geo.lng"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Company Information (Toggleable) */}
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
                <div className="form-group md-col-span-2">
                  <label htmlFor="company.name" className="form-label">
                    Company Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="company.name"
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleChange}
                    className={`form-input ${
                      formErrors["company.name"] ? "error" : ""
                    }`}
                    placeholder="e.g., Romaguera-Crona"
                  />
                  {formErrors["company.name"] && (
                    <p className="error-message">
                      {formErrors["company.name"]}
                    </p>
                  )}
                </div>
                <div className="form-group md-col-span-2">
                  <label htmlFor="company.catchPhrase" className="form-label">
                    Catch Phrase <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="company.catchPhrase"
                    name="company.catchPhrase"
                    value={formData.company.catchPhrase}
                    onChange={handleChange}
                    className={`form-input ${
                      formErrors["company.catchPhrase"] ? "error" : ""
                    }`}
                    placeholder="e.g., Multi-layered client-server neural-net"
                  />
                  {formErrors["company.catchPhrase"] && (
                    <p className="error-message">
                      {formErrors["company.catchPhrase"]}
                    </p>
                  )}
                </div>
                <div className="form-group md-col-span-2">
                  <label htmlFor="company.bs" className="form-label">
                    BS <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="company.bs"
                    name="company.bs"
                    value={formData.company.bs}
                    onChange={handleChange}
                    className={`form-input ${
                      formErrors["company.bs"] ? "error" : ""
                    }`}
                    placeholder="e.g., harness real-time e-markets"
                  />
                  {formErrors["company.bs"] && (
                    <p className="error-message">{formErrors["company.bs"]}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button and Status Messages */}
          <div className="submit-section">
            <button
              type="submit"
              className="submit-button"
              disabled={addStatus === "loading"}
            >
              {addStatus === "loading" ? "Adding User..." : "Add User"}
            </button>

            {showSuccessMessage && (
              <div className="success-message">
                <span className="message-icon">✅</span>
                User added successfully!
              </div>
            )}

            {addError && (
              <div className="error-alert">
                <span className="message-icon">❌</span>
                Error: {addError}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
