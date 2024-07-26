const { Stack, CfnOutput, RemovalPolicy } = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const deployment = require("aws-cdk-lib/aws-s3-deployment");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");

const path = require("path");

class frontEndStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
            websiteIndexDocument: "index.html",
                publicReadAccess: true,
                blockPublicAccess: {
                    blockPublicPolicy: false,
                    blockPublicAcls: false,
                    ignorePublicAcls: false,
                    restrictPublicBuckets: false,
                },
                removalPolicy: RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
        });

        new deployment.BucketDeployment(this, "DeployWebsite", {
            sources: [deployment.Source.asset(path.join(__dirname, "..", "src"))],
            destinationBucket: frontendBucket,
        });

        new cloudfront.CloudFrontWebDistribution(this, "FrontendDistribution", {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: frontendBucket,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
            defaultRootObject: "index.html"
        });

        new CfnOutput(this, "FrontendURL", {
            description: "Frontend URL",
            value: frontendBucket.bucketWebsiteUrl,
        });
    }
}

module.exports = { frontEndStack };