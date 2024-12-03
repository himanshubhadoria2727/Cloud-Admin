import LayoutHoc from "@/HOC/LayoutHoc";
import { Row, Col, Card, Button, Pagination, Input, Tag, Switch } from "antd";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./properties.module.css";

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch properties data (mock or API call)
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        name: "Luxury Villa",
        image: "/images/cottage.jpeg",
        seller: "John Doe",
        price: "$1,200,000",
        bedrooms: 4,
        bathrooms: 3,
        balcony: 2,
        verified: true,
      },
      {
        id: 2,
        name: "Modern Apartment",
        image: "/images/mordenhouse.webp",
        seller: "Jane Smith",
        price: "$850,000",
        bedrooms: 2,
        bathrooms: 2,
        balcony: 1,
        verified: false,
      },
      // Add more properties as needed
    ];
    setProperties(mockProperties);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleVerify = (id) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === id ? { ...property, verified: !property.verified } : property
      )
    );
  };

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const propertiesPerPage = 6;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );

  return (
    <LayoutHoc>
      <div className={styles.container}>
        <Row className={styles.header} justify="space-between" align="middle">
          <Col>
            <h2 className={styles.title}>Manage Properties</h2>
            <p>
              Showing {paginatedProperties.length} of {filteredProperties.length} properties
            </p>
          </Col>
          <Col>
            <Input
              placeholder="Search properties"
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {paginatedProperties.map((property) => (
            <Col xs={24} sm={12} lg={8} key={property.id}>
              <Card
                hoverable
                cover={
                  <Image
                    src={property.image}
                    alt={property.name}
                    layout="responsive"
                    width={300}
                    height={200}
                    className={styles.propertyImage}
                  />
                }
                className={styles.propertyCard}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.propertyTitle}>{property.name}</h3>
                  <p className={styles.propertySeller}>Seller: {property.seller}</p>
                  <p className={styles.propertyDetails}>
                    {property.bedrooms} Bedrooms • {property.bathrooms} Bathrooms • {property.balcony} Balcony
                  </p>
                  <p className={styles.propertyPrice}>{property.price}</p>
                  <div className={styles.propertyTags}>
                    <Tag color={property.verified ? "green" : "red"}>
                      {property.verified ? "Verified" : "Unverified"}
                    </Tag>
                  </div>
                  <div className={styles.actions}>
                    <Switch
                      checked={property.verified}
                      onChange={() => toggleVerify(property.id)}
                      className={styles.verifySwitch}
                      checkedChildren="Verified"
                      unCheckedChildren="Unverified"
                    />
                    <Button type="link" icon={<i className="fas fa-pen"></i>}>
                      Edit
                    </Button>
                    <Button type="link" danger icon={<i className="fas fa-trash"></i>}>
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
            total={filteredProperties.length}
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
