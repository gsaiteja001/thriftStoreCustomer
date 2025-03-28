import React, { useEffect, useState ,useContext } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Image, ListGroup, ListGroupItem, Button, Spinner } from 'react-bootstrap';
import { ChevronRight } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Goku from '../sonGoku.jpg';

import { LoginContext } from '../context/LoginContext';

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f4f9;
`;

const ProfileContainer = styled(Container)`
  background-color: #f4f4f9;
  height: 100vh;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  background-color: #8bc34a;
  border-radius: 20px;
  padding: 30px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

const ProfileInfo = styled.div`
  font-size: 1.2rem;
  margin-top: 10px;
  text-align: center;
  color: #333;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled(Image)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const UploadButton = styled(Button)`
  background-color: #8bc34a;
  border: none;
  &:hover {
    background-color: #7aa73a;
  }
`;

const SidebarItem = styled(ListGroupItem)`
  padding: 20px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Profile = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { wishlist_id, customer_id, setCustomerId, setCartId ,setWishIdlist } = useContext(LoginContext) || { setIsLoggedIn: () => {} };



  const fetchProfileData = async () => {
    try {
      const customer_id = localStorage.getItem('customerId');
      const response = await axios.get(`http://localhost:3000/api/customer/${customer_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [customer_id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleImageUpload = async (files) => {
    const filesArray = Array.isArray(files) ? files : [files];
    const formData = new FormData();

    filesArray.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post(
        'https://api.imgbb.com/1/upload?expiration=600&key=4cd9c9ee9a555c27315262a6a7d7a8b2',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageUrl = response.data.data.url;
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  if (loading) {
    return (
      <CenteredLoader>
        <Spinner animation="border" role="status" />
      </CenteredLoader>
    );
  }

  return (
    <ProfileContainer fluid>
      <ProfileHeader>
        <h2>Your Profile Details</h2>
        <ProfileInfo>
          <p>Name: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
        </ProfileInfo>
      </ProfileHeader>

      <Row>
        <Col md={4} className="d-flex flex-column align-items-center">
          <ProfileImageWrapper>
            <ProfileImage
              src={uploadedImage || Goku}
              roundedCircle
            />
          </ProfileImageWrapper>

          <div>
            <input type="file" onChange={handleFileChange} />
            <UploadButton onClick={() => handleImageUpload(imageFile)}>Upload New Profile Image</UploadButton>
          </div>
        </Col>

        <Col md={8}>
          <ListGroup>
            <SidebarItem onClick={() => navigate('/account-info')}>
              My Account
              <ChevronRight size="1.5rem" />
            </SidebarItem>
            <SidebarItem onClick={() => navigate('/payment')}>
              Payments
              <ChevronRight size="1.5rem" />
            </SidebarItem>
            <SidebarItem onClick={() => navigate('/location-picker')}>
              Saved addresses
              <ChevronRight size="1.5rem" />
            </SidebarItem>
            <SidebarItem onClick={() => navigate('/previous-orders')}>
              Previous Orders
              <ChevronRight size="1.5rem" />
            </SidebarItem>
            <SidebarItem onClick={handleLogout}>
              Logout
              <ChevronRight size="1.5rem" />
            </SidebarItem>
          </ListGroup>
        </Col>
      </Row>
    </ProfileContainer>
  );
};

export default Profile;
