using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.DAL.EntityConfiguration
{
    public class ArticleEntityConfiguration : IEntityTypeConfiguration<Article>
    {
        public void Configure(EntityTypeBuilder<Article> builder)
        {
            builder
                .Property(entity => entity.Id)
                .ValueGeneratedOnAdd();

            builder.HasKey(entity => entity.Id);

            builder
                .Property(entity => entity.Header)
                .HasMaxLength(50)
                .IsRequired();

            builder
                .Property(entity => entity.Text)
                .HasMaxLength(100000)
                .IsRequired();

            builder
                .Property(entity => entity.ImageName)
                .IsRequired();

            builder
                .HasOne(entity => entity.DataSource)
                .WithMany()
                .HasForeignKey(entity => entity.DataSourceId);

            builder
                .HasIndex(entity => new { entity.DataSourceId, entity.InternalId })
                .IsUnique();
        }
    }
}
