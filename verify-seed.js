const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();

    try {
        const userCount = await prisma.users.count();
        const postCount = await prisma.blog_posts.count();
        const categoryCount = await prisma.categories.count();
        const tagCount = await prisma.tags.count();
        const postTagCount = await prisma.post_tag.count();

        console.log('📊 Database Statistics:');
        console.log(`👤 Users: ${userCount}`);
        console.log(`📝 Blog Posts: ${postCount}`);
        console.log(`📂 Categories: ${categoryCount}`);
        console.log(`🏷️ Tags: ${tagCount}`);
        console.log(`🔗 Post-Tag Relations: ${postTagCount}`);

        // Get a sample post with relations
        const samplePost = await prisma.blog_posts.findFirst({
            include: {
                users: true,
                categories: true,
                post_tag: {
                    include: {
                        tags: true
                    }
                }
            }
        });

        if (samplePost) {
            console.log('\n📄 Sample Post:');
            console.log(`Title: ${samplePost.title}`);
            console.log(`Author: ${samplePost.users.name}`);
            console.log(`Category: ${samplePost.categories.name}`);
            console.log(`Tags: ${samplePost.post_tag.map(pt => pt.tags.name).join(', ')}`);
            console.log(`Published: ${samplePost.is_published ? 'Yes' : 'No'}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();