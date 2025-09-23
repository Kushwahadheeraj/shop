import { NextResponse } from 'next/server';
import sandboxDocs from '../sandbox-docs.js';

export async function GET() {
  try {
    console.log('🚀 Starting eWayBill Search GSTIN API test...');
    
    // Call the eWayBill API
    const result = await sandboxDocs.eWayBillSearchGstinApi();
    
    console.log('📊 eWayBill API Response:');
    console.log('=====================================');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    console.log('Timestamp:', result.timestamp);
    
    if (result.success && result.data) {
      console.log('\n📋 Business Details:');
      console.log('GSTIN:', result.data.gstin);
      console.log('Business Name:', result.data.businessName);
      console.log('Trade Name:', result.data.tradeName);
      
      console.log('\n🏢 Address Information:');
      console.log('Building:', result.data.address.buildingName);
      console.log('Street:', result.data.address.street);
      console.log('Location:', result.data.address.location);
      console.log('District:', result.data.address.district);
      console.log('State:', result.data.address.state);
      console.log('Pincode:', result.data.address.pincode);
      
      console.log('\n📅 Registration Details:');
      console.log('Registration Date:', result.data.registrationDetails.registrationDate);
      console.log('Registration Type:', result.data.registrationDetails.registrationType);
      console.log('Status:', result.data.registrationDetails.status);
      console.log('Last Updated:', result.data.registrationDetails.lastUpdated);
      
      console.log('\n💼 Business Information:');
      console.log('Constitution:', result.data.businessDetails.constitution);
      console.log('Business Type:', result.data.businessDetails.businessType);
      console.log('Nature of Business:', result.data.businessDetails.natureOfBusiness);
      console.log('Annual Turnover:', result.data.businessDetails.annualTurnover);
      console.log('Employees:', result.data.businessDetails.employees);
      
      console.log('\n💰 GST Details:');
      console.log('CGST Rate:', result.data.gstDetails.cgstRate + '%');
      console.log('SGST Rate:', result.data.gstDetails.sgstRate + '%');
      console.log('IGST Rate:', result.data.gstDetails.igstRate + '%');
      console.log('Cess Rate:', result.data.gstDetails.cessRate + '%');
      console.log('Tax Liability:', result.data.gstDetails.taxLiability);
      
      console.log('\n📊 Compliance Status:');
      console.log('GSTR1 Status:', result.data.complianceStatus.gstReturns.gstr1);
      console.log('GSTR3B Status:', result.data.complianceStatus.gstReturns.gstr3b);
      console.log('GSTR9 Status:', result.data.complianceStatus.gstReturns.gstr9);
      console.log('Last Filing Date:', result.data.complianceStatus.lastFilingDate);
      console.log('Next Due Date:', result.data.complianceStatus.nextDueDate);
      console.log('Penalty Amount:', result.data.complianceStatus.penaltyAmount);
      console.log('Interest Amount:', result.data.complianceStatus.interestAmount);
      
      console.log('\n🚛 eWayBill Details:');
      console.log('Can Generate eWayBill:', result.data.eWayBillDetails.canGenerateEWayBill);
      console.log('Last eWayBill Generated:', result.data.eWayBillDetails.lastEWayBillGenerated);
      console.log('Total eWayBills Generated:', result.data.eWayBillDetails.totalEWayBillsGenerated);
      console.log('Pending eWayBills:', result.data.eWayBillDetails.pendingEWayBills);
      console.log('Rejected eWayBills:', result.data.eWayBillDetails.rejectedEWayBills);
      
      console.log('\n🏦 Bank Details:');
      console.log('Account Number:', result.data.bankDetails.accountNumber);
      console.log('Bank Name:', result.data.bankDetails.bankName);
      console.log('IFSC Code:', result.data.bankDetails.ifscCode);
      console.log('Branch Name:', result.data.bankDetails.branchName);
      console.log('Account Type:', result.data.bankDetails.accountType);
      
      console.log('\n📞 Contact Details:');
      console.log('Primary Contact:', result.data.contactDetails.primaryContact);
      console.log('Secondary Contact:', result.data.contactDetails.secondaryContact);
      console.log('Email:', result.data.contactDetails.email);
      console.log('Website:', result.data.contactDetails.website);
      
      console.log('\n🆔 Additional Information:');
      console.log('PAN Number:', result.data.additionalInfo.panNumber);
      console.log('Aadhar Number:', result.data.additionalInfo.aadharNumber);
      console.log('TAN Number:', result.data.additionalInfo.tanNumber);
      console.log('CIN Number:', result.data.additionalInfo.cinNumber);
      console.log('Registration Number:', result.data.additionalInfo.registrationNumber);
      
      console.log('\n🔧 API Metadata:');
      console.log('Request ID:', result.data.apiMetadata.requestId);
      console.log('Timestamp:', result.data.apiMetadata.timestamp);
      console.log('Version:', result.data.apiMetadata.version);
      console.log('Source:', result.data.apiMetadata.source);
      console.log('Response Time:', result.data.apiMetadata.responseTime);
      
      console.log('\n✅ eWayBill API test completed successfully!');
    } else {
      console.log('\n❌ eWayBill API test failed:');
      console.log('Error Code:', result.error?.code);
      console.log('Error Message:', result.error?.message);
      console.log('Error Details:', result.error?.details);
    }
    
    console.log('=====================================');
    
    return NextResponse.json({
      success: true,
      message: 'eWayBill API test completed. Check console for detailed output.',
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error testing eWayBill API:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'API_TEST_ERROR',
        message: 'Failed to test eWayBill API',
        details: error.message
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { gstin, testType } = body;
    
    console.log(`🚀 Starting ${testType || 'eWayBill'} API test with GSTIN: ${gstin || 'Default'}`);
    
    let result;
    
    switch (testType) {
      case 'gstin-validation':
        result = await sandboxDocs.gstinValidationApi(gstin);
        break;
      case 'hsn-search':
        result = await sandboxDocs.hsnCodeSearchApi(gstin);
        break;
      default:
        result = await sandboxDocs.eWayBillSearchGstinApi();
    }
    
    console.log('📊 API Response:', JSON.stringify(result, null, 2));
    
    return NextResponse.json({
      success: true,
      message: `${testType || 'eWayBill'} API test completed. Check console for detailed output.`,
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'API_TEST_ERROR',
        message: 'Failed to test API',
        details: error.message
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
