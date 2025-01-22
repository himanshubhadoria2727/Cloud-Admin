import LayoutHoc from "@/HOC/LayoutHoc";
import {
  Row,
  Col,
  Card,
  Button,
  Pagination,
  Tag,
  Switch,
  Modal,
  notification,
} from "antd";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./properties.module.css";
import {
  useGetPropertiesQuery,
  useDeletePropertyMutation,
  useEditPropertyMutation,
} from "../../redux/slices/apiSlice";
import ImageSlider from "../../components/ImageSlider";
import { useRouter } from "next/router";

export default function ManageProperties() {
  const router = useRouter();
  const { data: properties = [], isLoading, error } = useGetPropertiesQuery();
  const [deleteProperty] = useDeletePropertyMutation();
  const [editProperty] = useEditPropertyMutation();
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchTerm, setSearchTerm] = useState("");

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  const toggleVerify = async (property) => {
    console.log("Attempting to verify property with ID:", property._id);
    try {
      const updatedProperty = { ...property, verified: !property.verified };
      await editProperty({ id: property._id, data: updatedProperty }).unwrap();
      console.log("Property verification status updated successfully");
    } catch (error) {
      console.error("Failed to update property verification status:", error);
      notification.error({
        message: "Update Failed",
        description:
          error.data ||
          "An error occurred while updating the property verification status.",
      });
    }
  };

  // const filteredProperties = properties.filter((property) =>
  //   property.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const propertiesPerPage = 6;
  const paginatedProperties = properties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this property?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteProperty(id).unwrap();
          console.log("Property deleted successfully");
        } catch (error) {
          console.error("Failed to delete property:", error);
        }
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading properties: {error.message}</p>;

  return (
    <LayoutHoc>
      <div className={styles.container}>
        <Row className={styles.header} justify="space-between" align="middle">
          <Col>
            <h2 className={styles.title}>Manage Properties</h2>
            <p>
              Showing {paginatedProperties.length} of {properties.length}{" "}
              properties
            </p>
          </Col>
          {/* <Col>
            <Input
              placeholder="Search properties"
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </Col> */}
        </Row>

        <Row gutter={[16, 16]}>
          {paginatedProperties.map((property) => (
            <Col xs={24} sm={12} lg={8} key={property.id}>
              <Card hoverable className={styles.propertyCard}>
                <ImageSlider images={property.images} />
                <div className={styles.cardContent}>
                  <h3 className={styles.propertyTitle}>{property.title} </h3>
                  <h3 className={styles.location}>
                    {property.city}{" "}
                    <span className={styles.propertyPrice}>
                      ${property.price}/month
                    </span>
                  </h3>
                  <p className={styles.propertySeller}>
                    Seller: {property.seller}
                  </p>
                  <p className={styles.propertyDetails}>
                    {property.overview.bedrooms} Bedrooms •{" "}
                    {property.overview.bathrooms} Bathrooms •{" "}
                    {property.overview.kitchen} Kitchen
                  </p>
                  <div className={styles.propertyTags}>
                    <Tag color={property.verified ? "green" : "red"}>
                      {property.verified ? "Verified" : "Unverified"}
                    </Tag>
                  </div>
                  <div className={styles.actions}>
                    <Switch
                      checked={property.verified}
                      onChange={() => toggleVerify(property)}
                      className={styles.verifySwitch}
                      checkedChildren="Verified"
                      unCheckedChildren="Unverified"
                    />
                    <Button
                      type="link"
                      icon={<i className="fas fa-pen"></i>}
                      onClick={() =>
                        router.push(
                          `/manage-properties/edit-property/${property._id}`
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      type="link"
                      danger
                      icon={<i className="fas fa-trash"></i>}
                      onClick={() => handleDelete(property?._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row justify="center" className={styles.pagination}>
          <Pagination
            current={currentPage}
            total={properties.length}
            pageSize={propertiesPerPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </Row>
        <Link href="/manage-properties/add-property">
          <Button type="primary" className={styles.addButton}>
            + Add Property
          </Button>
        </Link>
      </div>
    </LayoutHoc>
  );
}
