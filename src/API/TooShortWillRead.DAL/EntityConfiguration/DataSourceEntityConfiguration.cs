using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.DAL.EntityConfiguration
{
    class DataSourceEntityConfiguration : IEntityTypeConfiguration<DataSource>
    {
        public void Configure(EntityTypeBuilder<DataSource> builder)
        {
            builder.HasKey(entity => entity.Id);

            builder.Property(entity => entity.Name)
                .HasMaxLength(20)
                .IsRequired();

            builder.HasIndex(entity => entity.Name)
                .IsUnique();

            builder.HasData(
                new DataSource() { Id = 1, Name = "ManuallyCreated" },
                new DataSource() { Id = 2, Name = "Wikipedia" },
                new DataSource() { Id = 3, Name = "Britannica" },
                new DataSource() { Id = 4, Name = "HistoryCom" }
            );
        }
    }
}
