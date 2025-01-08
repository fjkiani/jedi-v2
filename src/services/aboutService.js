import { hygraphClient } from '@/lib/hygraph';

const GET_ABOUT_PAGE_DATA = `
  query GetAboutPageData {
    companyOverview(where: { id: "your-overview-id" }) {
      title
      description {
        raw
      }
      vision
      mission
      values {
        title
        description
        icon
      }
      heroImage {
        url
        width
        height
      }
    }
    teamMembers(orderBy: order_ASC) {
      id
      name
      position
      bio {
        raw
      }
      image {
        url
        width
        height
      }
      socialLinks {
        platform
        url
      }
      department
      isLeadership
      order
    }
    milestoneEvents(orderBy: year_ASC) {
      year
      title
      description
      image {
        url
        width
        height
      }
      order
    }
    officeLocations {
      city
      country
      address
      image {
        url
        width
        height
      }
      contactEmail
      phoneNumber
      isHeadquarters
    }
    companyStats {
      title
      value
      suffix
      description
      icon
    }
  }
`;

export const aboutService = {
  getAboutPageData: async () => {
    try {
      const data = await hygraphClient.request(GET_ABOUT_PAGE_DATA);
      return data;
    } catch (error) {
      console.error('Error fetching about page data:', error);
      throw error;
    }
  }
}; 