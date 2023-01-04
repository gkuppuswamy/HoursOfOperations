const AWS = require('aws-sdk');

module.exports.handler = async (event,context) => {
  console.log("Log incoming event......")
  console.log(event);
  // const body = JSON.parse(Buffer.from(event.body, 'base64').toString())
  const body = JSON.parse(event.body)
  console.log("Setting Params....")
  const params = {
    TableName : process.env.DYNAMODB_HOOPS_TABLE,
    Item: {
       Queue_Id: body.Queue_Id,
       WorkingHours: body.WorkingHours,
       Holiday:body.Holiday
    }
  }
  console.log(params)
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    let result = await dynamoDb.put(params).promise()
  } catch (error) {
    console.log("DB Insert Error:", error)
    return { error: error }
  }

  return {
    statusCode: 200,
    message: "Successfully added"
  }
}