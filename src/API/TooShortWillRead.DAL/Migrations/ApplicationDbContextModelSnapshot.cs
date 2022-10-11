﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TooShortWillRead.DAL;

#nullable disable

namespace TooShortWillRead.DAL.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("ArticleCategory", b =>
                {
                    b.Property<Guid>("ArticlesId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("CategoriesName")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("ArticlesId", "CategoriesName");

                    b.HasIndex("CategoriesName");

                    b.ToTable("ArticleCategory");
                });

            modelBuilder.Entity("TooShortWillRead.DAL.Models.Article", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getutcdate()");

                    b.Property<int>("DataSourceId")
                        .HasColumnType("int");

                    b.Property<string>("Header")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.Property<string>("ImageName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("InternalId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("OriginalUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasMaxLength(100000)
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getutcdate()");

                    b.HasKey("Id");

                    b.HasIndex("DataSourceId", "InternalId")
                        .IsUnique()
                        .HasFilter("[InternalId] IS NOT NULL");

                    b.ToTable("Articles");
                });

            modelBuilder.Entity("TooShortWillRead.DAL.Models.Category", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Name");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("TooShortWillRead.DAL.Models.DataSource", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("DataSource");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "ManuallyCreated"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Wikipedia"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Britannica"
                        },
                        new
                        {
                            Id = 4,
                            Name = "HistoryCom"
                        });
                });

            modelBuilder.Entity("ArticleCategory", b =>
                {
                    b.HasOne("TooShortWillRead.DAL.Models.Article", null)
                        .WithMany()
                        .HasForeignKey("ArticlesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TooShortWillRead.DAL.Models.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoriesName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TooShortWillRead.DAL.Models.Article", b =>
                {
                    b.HasOne("TooShortWillRead.DAL.Models.DataSource", "DataSource")
                        .WithMany()
                        .HasForeignKey("DataSourceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DataSource");
                });
#pragma warning restore 612, 618
        }
    }
}
