const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const util = require('util')

async function listItems(params){
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}

module.exports.handler = async (event, context) => {

  const params = {
    TableName : process.env.DYNAMODB_HOOPS_TABLE
  }

  try {
    const data = await listItems(params)
    // console.log('Get Data', data)
    console.log(util.inspect(data, false, null, true))
    if(data.Count === 0){
        return {
            statusCode: 404
        }
    }

    return { 
        statusCode: 200,
        body: JSON.stringify({
            total: data.Count,
            items: await data.Items.map((item)=>{
                return {
                    Queue_Id: item.Queue_Id,
                    WorkingHours: item.WorkingHours,
                    Holiday:item.Holiday
                }
            })

        })
    }
  } catch (err) {
    console.log(err)
    return { error: err }
  }
}